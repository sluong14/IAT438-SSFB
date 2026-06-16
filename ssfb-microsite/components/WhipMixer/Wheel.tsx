'use client';

import { useRef, useState } from 'react';

type Props = {
  trackTitle?: string;
  artistName?: string;
};

export function Wheel({ trackTitle, artistName }: Props) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);

  function getAngle(e: React.MouseEvent) {
    const rect = wheelRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
  }

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    lastAngle.current = getAngle(e);
    e.preventDefault();
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    const angle = getAngle(e);
    const delta = angle - lastAngle.current;
    setRotation((r) => r + delta);
    lastAngle.current = angle;
  }

  function onMouseUp() {
    isDragging.current = false;
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 relative">
      {/* Screen display */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] bg-[#111] text-center px-4 py-2 z-10">
        <div className="font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-[#454545] mb-1">
          {artistName ?? 'NO ARTIST'}
        </div>
        <div className="font-[family-name:var(--font-display)] text-[28px] uppercase text-white leading-none">
          {trackTitle ?? '—'}
        </div>
      </div>

      {/* Vinyl wheel */}
      <div
        ref={wheelRef}
        className="relative w-[420px] h-[420px] rounded-full cursor-grab active:cursor-grabbing select-none"
        style={{
          background: 'radial-gradient(circle, #3a0000 0%, #1a0000 40%, #0a0000 70%, #000 100%)',
          boxShadow: '0 0 60px rgba(255,0,0,0.3), inset 0 0 40px rgba(0,0,0,0.8)',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'repeating-conic-gradient(rgba(255,0,0,0.05) 0deg, transparent 2deg, transparent 8deg)',
            transform: `rotate(${rotation}deg)`,
            transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
          }}
        />
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[80px] h-[80px] rounded-full bg-black border border-[#333] flex items-center justify-center"
          >
            <span className="font-[family-name:var(--font-ui)] text-[16px] uppercase text-[#454545] tracking-[-0.64px]">
              wheel
            </span>
          </div>
        </div>
      </div>

      {/* Play controls */}
      <div className="flex items-center gap-[24px] mt-[24px]">
        <button
          className="font-[family-name:var(--font-ui)] text-[16px] text-white hover:text-red transition-colors"
          title="TODO: load previous track"
        >
          ◄
        </button>
        <button
          className="w-[48px] h-[48px] rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-300 transition-colors"
          title="TODO: connect to Web Audio API"
        >
          <span className="font-[family-name:var(--font-ui)] text-[16px] text-black">‖</span>
        </button>
        <button
          className="font-[family-name:var(--font-ui)] text-[16px] text-white hover:text-red transition-colors"
          title="TODO: load next track"
        >
          ►
        </button>
      </div>
    </div>
  );
}
