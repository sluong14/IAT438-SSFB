'use client';

import { useRef, useState } from 'react';

export function Tempo() {
  const [position, setPosition] = useState(50); // 0–100
  const isDragging = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  function getPos(e: React.MouseEvent) {
    const rect = trackRef.current!.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
  }

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    setPosition(getPos(e));
    e.preventDefault();
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    setPosition(getPos(e));
  }

  function onMouseUp() {
    isDragging.current = false;
  }

  return (
    <div className="flex flex-col gap-[8px] w-full">
      <span className="font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-[#454545]">
        TEMPO
      </span>
      <div
        ref={trackRef}
        className="relative h-[8px] bg-[#333] rounded-full cursor-pointer w-full select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          className="absolute top-0 left-0 h-full bg-red rounded-full"
          style={{ width: `${position}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] rounded-full bg-white border-2 border-red -translate-x-1/2"
          style={{ left: `${position}%` }}
        />
      </div>
    </div>
  );
}
