'use client';

import { useRef, useState } from 'react';

function Knob({ label, defaultAngle = 0 }: { label: string; defaultAngle?: number }) {
  const [angle, setAngle] = useState(defaultAngle);
  const isDragging = useRef(false);
  const lastY = useRef(0);

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    lastY.current = e.clientY;
    e.preventDefault();
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    const delta = lastY.current - e.clientY;
    setAngle((a) => Math.max(-135, Math.min(135, a + delta * 1.5)));
    lastY.current = e.clientY;
  }

  function onMouseUp() {
    isDragging.current = false;
  }

  return (
    <div className="flex flex-col items-center gap-[6px]">
      <div
        className="w-[40px] h-[40px] rounded-full bg-[#1E1E1E] border border-[#454545] cursor-ns-resize relative select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          className="absolute top-[4px] left-1/2 w-[2px] h-[12px] bg-red -translate-x-1/2 rounded-full origin-[50%_100%]"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)`, transformOrigin: '50% 100%', top: 4 }}
        />
      </div>
      <span className="font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-[#454545]">
        {label}
      </span>
    </div>
  );
}

export function EQControl() {
  return (
    <div className="flex flex-col gap-[8px]">
      <span className="font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-[#454545]">
        EQ CONTROL
      </span>
      <div className="flex flex-col gap-[16px]">
        <Knob label="HI" defaultAngle={45} />
        <Knob label="MID" defaultAngle={0} />
        <Knob label="LOW" defaultAngle={-30} />
      </div>
    </div>
  );
}
