'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_PARAMS, StippleParams, drawStipple } from '@/lib/stipple'

declare global {
  interface Window {
    Cesium: any
  }
}

const CESIUM_VERSION = '1.122'
const CESIUM_CDN = `https://cesium.com/downloads/cesiumjs/releases/${CESIUM_VERSION}/Build/Cesium`

// Noorderlicht building, NDSM Wharf — tight oblique 3D "focus" view
const FOCUS_POINT = { lon: 4.8965555058510875, lat: 52.39957905557068 }
// Whole NDSM Wharf — wide top-down "explore" view
const WHARF_CENTER = { lon: 4.8994, lat: 52.4006 }

interface ViewConfig {
  center: { lon: number; lat: number }
  altitude: number
  heading: number  // degrees
  pitch: number    // degrees
  minZoom: number
  maxZoom: number
  boundaryDeg: number // max drift from center before camera snaps back
}

// "focus" = initial tight 3D oblique shot of the Noorderlicht building, matching the
// Figma "noordlight" reference frame's perspective (heading/pitch are a visual estimate
// — a flat screenshot doesn't encode exact compass bearing, nudge if it doesn't match).
// "explore" = 2D top-down view zoomed out to see the whole wharf, entered via the
// Explore button.
const VIEWS: Record<'focus' | 'explore', ViewConfig> = {
  focus: {
    center: FOCUS_POINT,
    altitude: 90,
    heading: 110,
    pitch: -30,
    minZoom: 30,
    maxZoom: 250,
    boundaryDeg: 0.012, // ~1.3km — generous enough that orbiting around the building doesn't trigger a snap-back
  },
  explore: {
    center: WHARF_CENTER,
    altitude: 1500,
    heading: 0,
    pitch: -89.9,
    minZoom: 100,
    maxZoom: 3000,
    boundaryDeg: 0.025, // ~2.5km — covers the whole wharf
  },
}

export default function StippleMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewerRef = useRef<any>(null)
  const paramsRef = useRef<StippleParams>(DEFAULT_PARAMS)

  const [mode, setMode] = useState<'focus' | 'explore'>('focus')
  const viewRef = useRef<'focus' | 'explore'>('focus')
  const [params, setParams] = useState<StippleParams>(DEFAULT_PARAMS)
  const [showControls, setShowControls] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  // Keep ref in sync so the postRender callback always reads latest params
  useEffect(() => {
    paramsRef.current = params
    // Ask Cesium to re-render so postRender fires and the stipple updates
    viewerRef.current?.scene.requestRender()
  }, [params])

  // Load CesiumJS from CDN and initialise the viewer
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `${CESIUM_CDN}/Widgets/widgets.css`
    document.head.appendChild(link)

    let viewer: any = null
    let unmounted = false

    const init = () => {
      if (unmounted) return
      const Cesium = window.Cesium
      const container = mapRef.current
      const canvas = canvasRef.current
      if (!Cesium || !container || !canvas) return

      const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      const ionToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN
      if (ionToken) Cesium.Ion.defaultAccessToken = ionToken
      if (googleKey) Cesium.GoogleMaps.defaultApiKey = googleKey

      viewer = new Cesium.Viewer(container, {
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        // No default imagery — Google 3D tiles provide everything
        imageryProvider: false,
        contextOptions: {
          // Required so we can call drawImage(cesiumCanvas) each frame
          webgl: { preserveDrawingBuffer: true },
        },
        requestRenderMode: true, // only render when something changes
      })

      viewer.scene.backgroundColor = Cesium.Color.BLACK
      viewerRef.current = viewer

      // Free orbit/rotate around the focus point — explicit so it doesn't
      // depend on Cesium defaults, and collision detection is off so the
      // camera doesn't snag when rotating close to building geometry.
      const ctrl = viewer.scene.screenSpaceCameraController
      ctrl.enableRotate = true
      ctrl.enableTilt = true
      ctrl.enableLook = true
      ctrl.enableCollisionDetection = false

      const flyToView = (key: 'focus' | 'explore', duration: number) => {
        const v = VIEWS[key]
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(v.center.lon, v.center.lat, v.altitude),
          orientation: {
            heading: Cesium.Math.toRadians(v.heading),
            pitch: Cesium.Math.toRadians(v.pitch),
            roll: 0,
          },
          duration,
        })
        ctrl.minimumZoomDistance = v.minZoom
        ctrl.maximumZoomDistance = v.maxZoom
      }

      Cesium.createGooglePhotorealistic3DTileset()
        .then((tileset: any) => {
          if (unmounted) return
          viewer.scene.primitives.add(tileset)

          flyToView('focus', 2)

          // Boundary guard: if the camera drifts too far from the active view's
          // center, fly back — reads viewRef so it stays current across mode switches
          viewer.camera.moveEnd.addEventListener(() => {
            const v = VIEWS[viewRef.current]
            const pos = viewer.camera.positionCartographic
            const lat = Cesium.Math.toDegrees(pos.latitude)
            const lon = Cesium.Math.toDegrees(pos.longitude)
            if (
              Math.abs(lat - v.center.lat) > v.boundaryDeg ||
              Math.abs(lon - v.center.lon) > v.boundaryDeg
            ) {
              flyToView(viewRef.current, 1.2)
            }
          })

          setStatus('ready')
        })
        .catch(() => setStatus('error'))

      // Size the stipple canvas to match the window
      const resizeCanvas = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)

      // After every Cesium frame, render the stipple pass
      const ctx = canvas.getContext('2d')!
      viewer.scene.postRender.addEventListener(() => {
        const src = viewer.scene.canvas as HTMLCanvasElement
        if (src.width > 0 && src.height > 0) {
          try {
            drawStipple(ctx, src, paramsRef.current)
          } catch {
            // Silently ignore any one-off pixel-read errors
          }
        }
      })

      // Clean up resize listener when viewer is destroyed
      viewer.destroyedEvent?.addEventListener(() => {
        window.removeEventListener('resize', resizeCanvas)
      })
    }

    const script = document.createElement('script')
    script.src = `${CESIUM_CDN}/Cesium.js`
    script.async = true
    script.onload = init
    script.onerror = () => setStatus('error')
    document.head.appendChild(script)

    return () => {
      unmounted = true
      viewer?.destroy()
      // Only remove if still in head (unmount during load could race)
      if (document.head.contains(script)) document.head.removeChild(script)
      if (document.head.contains(link)) document.head.removeChild(link)
    }
  }, [])

  const flyToView = useCallback((key: 'focus' | 'explore', duration: number) => {
    const viewer = viewerRef.current
    const Cesium = window.Cesium
    if (!viewer || !Cesium) return
    const v = VIEWS[key]
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(v.center.lon, v.center.lat, v.altitude),
      orientation: {
        heading: Cesium.Math.toRadians(v.heading),
        pitch: Cesium.Math.toRadians(v.pitch),
        roll: 0,
      },
      duration,
    })
    const ctrl = viewer.scene.screenSpaceCameraController
    ctrl.minimumZoomDistance = v.minZoom
    ctrl.maximumZoomDistance = v.maxZoom
  }, [])

  const flyHome = useCallback(() => {
    flyToView(mode, 1.5)
  }, [flyToView, mode])

  // Explore toggles between the tight 3D Noorderlicht focus shot and a wide
  // 2D top-down view of the whole NDSM wharf.
  const toggleExplore = useCallback(() => {
    const next = mode === 'focus' ? 'explore' : 'focus'
    viewRef.current = next
    setMode(next)
    flyToView(next, 1.5)
  }, [mode, flyToView])

  const setParam = useCallback(
    <K extends keyof StippleParams>(key: K, value: StippleParams[K]) => {
      setParams(p => ({ ...p, [key]: value }))
    },
    [],
  )

  return (
    <div style={styles.root}>
      {/* Cesium renders here — it sits underneath and receives all pointer events */}
      <div ref={mapRef} style={styles.cesium} />

      {/* Stipple canvas — covers Cesium visually; pointer-events: none lets
          clicks/drags pass through to the Cesium container below */}
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* UI layer — pointer-events: none on the container, re-enabled per element */}
      <div style={styles.ui}>
        {status === 'loading' && (
          <div style={styles.status}>loading cesium...</div>
        )}
        {status === 'error' && (
          <div style={{ ...styles.status, color: '#f00' }}>
            map error — check .env.local for API keys
          </div>
        )}

        {status === 'ready' && (
          <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, pointerEvents: 'all' }}>
            <button style={styles.btn} onClick={toggleExplore}>
              {mode === 'focus' ? '[ Explore ]' : '[ 3D ]'}
            </button>
            <button style={styles.btn} onClick={flyHome}>
              [ NDSM ]
            </button>
          </div>
        )}

        <button
          style={{ ...styles.btn, position: 'absolute', top: 16, right: 16 }}
          onClick={() => setShowControls(v => !v)}
        >
          {showControls ? '[ close ]' : '[ stipple ]'}
        </button>

        {showControls && (
          <div style={styles.panel}>
            <Slider
              label="threshold"
              min={0} max={255} step={1}
              value={params.threshold}
              onChange={v => setParam('threshold', v)}
            />
            <Slider
              label="y squares"
              min={1} max={150} step={1}
              value={params.ySquares}
              onChange={v => setParam('ySquares', v)}
            />
            <Slider
              label="x squares"
              min={10} max={200} step={1}
              value={params.xSquares}
              onChange={v => setParam('xSquares', v)}
            />
            <Slider
              label="min size"
              min={0} max={20} step={0.5}
              value={params.minDotSize}
              onChange={v => setParam('minDotSize', v)}
            />
            <Slider
              label="max size"
              min={0} max={30} step={0.5}
              value={params.maxDotSize}
              onChange={v => setParam('maxDotSize', v)}
            />
            <Slider
              label="angle"
              min={-45} max={45} step={1}
              value={params.angle}
              onChange={v => setParam('angle', v)}
              unit="°"
            />
            <div style={styles.row}>
              <span style={styles.label}>grid</span>
              <button
                style={params.gridType === 'Regular' ? styles.btnActive : styles.btnInactive}
                onClick={() => setParam('gridType', 'Regular')}
              >
                regular
              </button>
              <button
                style={params.gridType === 'Benday' ? styles.btnActive : styles.btnInactive}
                onClick={() => setParam('gridType', 'Benday')}
              >
                benday
              </button>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>bg</span>
              <input
                type="color"
                value={params.bgColor}
                onChange={e => setParam('bgColor', e.target.value)}
                style={{ width: 36, height: 22, border: '1px solid #000', cursor: 'pointer', padding: 0 }}
              />
              <span style={styles.label}>dots</span>
              <input
                type="color"
                value={params.dotColor}
                onChange={e => setParam('dotColor', e.target.value)}
                style={{ width: 36, height: 22, border: '1px solid #000', cursor: 'pointer', padding: 0 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Slider sub-component ────────────────────────────────────────────────────

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit = '',
}: {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  unit?: string
}) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={styles.range}
      />
      <span style={styles.val}>
        {value}
        {unit}
      </span>
    </div>
  )
}

// ── Inline styles ───────────────────────────────────────────────────────────

const styles = {
  root: {
    position: 'fixed' as const,
    inset: 0,
  },
  cesium: {
    position: 'absolute' as const,
    inset: 0,
    zIndex: 1,
  },
  canvas: {
    position: 'absolute' as const,
    inset: 0,
    zIndex: 2,
    display: 'block',
    pointerEvents: 'none' as const,
  },
  ui: {
    position: 'absolute' as const,
    inset: 0,
    zIndex: 3,
    pointerEvents: 'none' as const,
  },
  status: {
    position: 'absolute' as const,
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 12,
    letterSpacing: '0.05em',
    pointerEvents: 'none' as const,
  },
  btn: {
    pointerEvents: 'all' as const,
    background: 'transparent',
    border: 'none',
    font: 'inherit',
    fontSize: 13,
    letterSpacing: '0.08em',
    cursor: 'pointer',
    color: '#000',
    backgroundColor: '#fff',
    padding: '6px 14px',
  } as React.CSSProperties,
  panel: {
    position: 'absolute' as const,
    top: 48,
    right: 16,
    background: '#fff',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
    minWidth: 280,
    pointerEvents: 'all' as const,
    fontSize: 12,
    letterSpacing: '0.04em',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    width: 72,
    flexShrink: 0,
    fontSize: 11,
    letterSpacing: '0.06em',
  },
  range: {
    flex: 1,
    accentColor: '#000',
  },
  val: {
    width: 36,
    textAlign: 'right' as const,
    fontSize: 11,
  },
  btnActive: {
    background: '#000',
    color: '#fff',
    border: 'none',
    font: 'inherit',
    fontSize: 11,
    padding: '3px 8px',
    cursor: 'pointer',
    letterSpacing: '0.04em',
  },
  btnInactive: {
    background: 'none',
    color: '#000',
    border: '1px solid #000',
    font: 'inherit',
    fontSize: 11,
    padding: '3px 8px',
    cursor: 'pointer',
    letterSpacing: '0.04em',
  },
} as const
