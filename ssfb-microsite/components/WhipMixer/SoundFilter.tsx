'use client';

import { useState } from 'react';

const FILTERS = ['RADIO FILTER', 'HIGH BOOST', 'LOW BOOST'] as const;

function Toggle({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <button
      className="flex items-center gap-[8px] group"
      onClick={onToggle}
    >
      <div
        className={`w-[32px] h-[16px] rounded-full relative transition-colors ${
          active ? 'bg-red' : 'bg-[#333]'
        }`}
      >
        <div
          className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white transition-transform ${
            active ? 'translate-x-[18px]' : 'translate-x-[2px]'
          }`}
        />
      </div>
      <span className="font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-white">
        {label}
      </span>
    </button>
  );
}

export function SoundFilter() {
  const [active, setActive] = useState<boolean[]>([false, false, false]);

  function toggle(i: number) {
    setActive((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <span className="font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-[#454545]">
        SOUND FILTER
      </span>
      <div className="flex flex-col gap-[12px]">
        {FILTERS.map((label, i) => (
          <Toggle key={label} label={label} active={active[i]} onToggle={() => toggle(i)} />
        ))}
      </div>
    </div>
  );
}
