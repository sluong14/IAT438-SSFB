export interface StippleParams {
  ySquares: number
  xSquares: number
  minDotSize: number
  maxDotSize: number
  angle: number          // degrees
  gridType: 'Regular' | 'Benday'
  threshold: number      // 0–255: pixels darker than this get drawn
  bgColor: string
  dotColor: string
}

export const DEFAULT_PARAMS: StippleParams = {
  ySquares: 150,
  xSquares: 200,
  minDotSize: 0.5,
  maxDotSize: 12,
  angle: 0,
  gridType: 'Regular',
  threshold: 255,
  bgColor: '#e6e6df',   // exact frame background from Figma
  dotColor: '#1a1a18',  // near-black; thin bars on cream optically read as #959595 gray
}

// Reused across frames — avoids allocating a canvas on every call
let _sampleCanvas: HTMLCanvasElement | null = null
let _sampleCtx: CanvasRenderingContext2D | null = null

function getSampleContext(w: number, h: number): CanvasRenderingContext2D {
  if (!_sampleCanvas) {
    _sampleCanvas = document.createElement('canvas')
    // willReadFrequently optimises repeated getImageData calls
    _sampleCtx = _sampleCanvas.getContext('2d', { willReadFrequently: true })!
  }
  if (_sampleCanvas.width !== w || _sampleCanvas.height !== h) {
    _sampleCanvas.width = w
    _sampleCanvas.height = h
  }
  return _sampleCtx!
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return outMin + (outMax - outMin) * ((v - inMin) / (inMax - inMin))
}

/**
 * Draws a stipple render of `source` into `ctx`.
 * Ported from the tooooools.app stippling algorithm (p5.js → vanilla Canvas 2D).
 *
 * `source` can be the Cesium scene canvas or a <video> element.
 */
export function drawStipple(
  ctx: CanvasRenderingContext2D,
  source: HTMLCanvasElement | HTMLVideoElement,
  params: StippleParams,
): void {
  const W = ctx.canvas.width
  const H = ctx.canvas.height
  if (W === 0 || H === 0) return

  // Copy source into a 2D context so we can call getImageData
  const sampleCtx = getSampleContext(W, H)
  sampleCtx.drawImage(source as CanvasImageSource, 0, 0, W, H)

  let pixels: Uint8ClampedArray
  try {
    pixels = sampleCtx.getImageData(0, 0, W, H).data
  } catch {
    // Cross-origin taint — can't read pixels
    return
  }

  const sample = (x: number, y: number) => {
    const px = Math.min(Math.max(0, Math.floor(x)), W - 1)
    const py = Math.min(Math.max(0, Math.floor(y)), H - 1)
    const i = (px + py * W) * 4
    return { r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], a: pixels[i + 3] }
  }

  const rad = (params.angle * Math.PI) / 180
  const cosA = Math.cos(rad)
  const sinA = Math.sin(rad)
  // Normalisation factor keeps cell sizes consistent at any angle
  const norm = Math.abs(cosA) + Math.abs(sinA)
  const cellH = H / params.ySquares / norm
  const cellW = W / params.xSquares / norm
  // Sweep radius large enough to cover the canvas at any rotation
  const diag = Math.sqrt(W * W + H * H)
  const R = diag / 2 + Math.max(cellW, cellH)
  const cx = W / 2
  const cy = H / 2
  // Slight compression so adjacent cells always overlap cleanly
  const stepH = (cellH - 0.1) * 0.99
  const stepW = (cellW - 0.1) * 0.99

  ctx.fillStyle = params.bgColor
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = params.dotColor

  for (let row = -R; row < diag + R; row += stepH) {
    // Benday mode offsets every other column (classic halftone pattern)
    const benday =
      params.gridType === 'Benday'
        ? ((cellW - 0.1) / 2) * (Math.floor(row / stepH) % 2)
        : 0

    for (let col = -R; col < diag + R; col += stepW) {
      // Rotate grid coordinates into screen space
      const u = col + benday
      const v = row
      const sx = cx + u * cosA - v * sinA
      const sy = cy + u * sinA + v * cosA

      const { r, g, b, a } = sample(sx, sy)
      const alpha = a / 255
      // Alpha-premultiplied perceived lightness
      const L = (lerp(255, r, alpha) + lerp(255, g, alpha) + lerp(255, b, alpha)) / 3

      // Dark pixels → large dots; bright pixels → small/no dots
      const rawDot =
        L < params.threshold
          ? mapRange(L, 0, params.threshold, params.maxDotSize, params.minDotSize)
          : params.minDotSize

      const dw = (rawDot > 1 ? rawDot + 0.05 : rawDot) / norm

      if (dw > 0 && cellH > 0) {
        // setTransform is faster than ctx.save/rotate/restore per cell
        ctx.setTransform(cosA, sinA, -sinA, cosA, sx, sy)
        ctx.fillRect(-dw / 2, -cellH / 2, dw, cellH)
      }
    }
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
}
