'use client';

import { useEffect, useState } from 'react';

function formatTime(date: Date, timeZone?: string): string {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone,
  });
}

function getOffset(date: Date, timeZone?: string): string {
  const raw = new Intl.DateTimeFormat('en', {
    timeZone,
    timeZoneName: 'shortOffset',
  })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')?.value ?? '';
  return raw.replace('GMT', 'UTC');
}

export default function TimeDisplay() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const localTime = now ? formatTime(now) : '--:--:--';
  const amsTime = now ? formatTime(now, 'Europe/Amsterdam') : '--:--:--';
  const localOffset = now ? getOffset(now) : '';
  const amsOffset = now ? getOffset(now, 'Europe/Amsterdam') : '';

  const cls = 'font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-black tabular-nums';

  return (
    <div className="flex flex-col gap-[24px] w-[240px]">
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[2px]">
          <span className={cls}>LOCAL HOUR:</span>
          <span className={cls}>{localTime} [{localOffset}]</span>
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className={cls}>CET HOUR:</span>
          <span className={cls}>{amsTime} [{amsOffset}]</span>
        </div>
      </div>

      <div className={cls + ' w-full'}>
        TivoliVredenburg, Vredenburgkade 11, 3511 WC Utrecht, Netherlands
      </div>
    </div>
  );
}
