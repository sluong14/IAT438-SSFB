'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

const HIDDEN_MASK = 'radial-gradient(ellipse 0px 0px at 50% 50%, transparent 100%, transparent 100%)';

function processSvg(raw: string): string {
  return raw
    .replace('width="1728" height="1117"', 'width="100%" height="100%" preserveAspectRatio="xMidYMid slice"')
    .replace(/fill="#959595"/g, 'fill="currentColor"');
}

export default function EntryClient() {
  const audioRef     = useRef<HTMLAudioElement>(null);
  const baseRef      = useRef<HTMLDivElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const isPlayingRef  = useRef(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cueHiddenRef  = useRef(false);

  const [svgHtml, setSvgHtml]   = useState('');
  const [isMuted, setIsMuted]   = useState(false);
  const [showCue, setShowCue]   = useState(true);

  useEffect(() => {
    fetch('/images/stippling-background.svg')
      .then(r => r.text())
      .then(raw => setSvgHtml(processSvg(raw)));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;

    // Red tracking line
    if (lineRef.current) {
      lineRef.current.style.left    = `${x}px`;
      lineRef.current.style.opacity = '1';
    }

    // Bloom: radial gradient mask reveals red bars around cursor
    if (overlayRef.current) {
      overlayRef.current.style.maskImage = `radial-gradient(ellipse 60px 100vh at ${x}px 50%, black 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)`;
    }

    // Audio: only play when cursor is directly over an SVG bar (path element)
    const target = e.target as Element;
    const overBar = target.tagName.toLowerCase() === 'path' && !!baseRef.current?.contains(target as Node);

    if (overBar) {
      if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; }
      if (!isPlayingRef.current) {
        isPlayingRef.current = true;
        audioRef.current?.play().catch(() => {});
      }
      if (!cueHiddenRef.current) {
        cueHiddenRef.current = true;
        setShowCue(false);
      }
    } else if (isPlayingRef.current && !pauseTimerRef.current) {
      // Short grace period so audio doesn't stutter crossing bar gaps
      pauseTimerRef.current = setTimeout(() => {
        pauseTimerRef.current = null;
        isPlayingRef.current = false;
        audioRef.current?.pause();
      }, 150);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (lineRef.current) lineRef.current.style.opacity = '0';
    if (overlayRef.current) overlayRef.current.style.maskImage = HIDDEN_MASK;
    if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; }
    isPlayingRef.current = false;
    audioRef.current?.pause();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  return (
    <div className="contents">
      <div
        className="fixed inset-0 z-[200] bg-white overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <audio ref={audioRef} src="/audio/ATA-KAK.mp3" loop preload="auto" />

        {/* Gray stippling base */}
        <div
          ref={baseRef}
          className="absolute inset-0"
          style={{ color: '#959595' }}
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />

        {/* Red overlay — same SVG, masked by JS radial gradient */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            color: '#FF0000',
            maskImage: HIDDEN_MASK,
          }}
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />

        {/* SSFB logo centred */}
        <img
          src="/images/ssfb-logo.svg"
          alt="Strange Sounds From Beyond"
          className="absolute pointer-events-none"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '38%', maxWidth: '560px' }}
        />

        {/* Hover cue */}
        <span
          className="label absolute pointer-events-none"
          style={{
            top: '60%', left: '50%', transform: 'translateX(-50%)',
            opacity: showCue ? 1 : 0,
            transition: 'opacity 600ms ease',
          }}
        >
          [HOVER TO PLAY SOUND]
        </span>

        {/* Enter CTA */}
        <Link
          href="/home"
          className="label entry-cta absolute"
          style={{ bottom: '8%', left: '50%', transform: 'translateX(-50%)' }}
        >
          CLICK TO ENTER SITE
        </Link>

        {/* Corner labels */}
        <span className="label absolute" style={{ top: '2%', left: '1%' }}>[2018]</span>
        <span className="label absolute" style={{ top: '2%', right: '1%' }}>[18:00:00]</span>
        <span className="label absolute" style={{ bottom: '2%', left: '1%' }}>[AMSTERDAM]</span>

        {/* Bottom-right: mute + label */}
        <div className="absolute flex items-center gap-2" style={{ bottom: '2%', right: '1%' }}>
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            style={{
              background: 'black',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
            }}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
          <span className="label">[STRANGE SOUNDS FROM BEYOND]</span>
        </div>
      </div>

      {/* Tracking line */}
      <div ref={lineRef} className="tracking-line" />
    </div>
  );
}
