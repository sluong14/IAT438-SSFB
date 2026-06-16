'use client';

const BAR_COUNT = 32;
const HEIGHTS = [
  20, 35, 55, 40, 70, 50, 80, 60, 45, 90, 65, 75, 55, 85, 40, 95,
  70, 50, 80, 60, 45, 90, 65, 75, 30, 55, 40, 70, 50, 80, 60, 45,
];

export function Visualizer() {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-[#454545]">
        VISUALIZER
      </span>
      <div className="flex items-end gap-[2px] h-[80px]">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            className="w-[3px] bg-red-dark flex-shrink-0"
            style={{ height: `${HEIGHTS[i % HEIGHTS.length]}%` }}
          />
        ))}
      </div>
    </div>
  );
}
