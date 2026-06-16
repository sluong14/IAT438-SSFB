// Schedule page: /schedule — static timeline layout
import { artists } from '@/data/artists';
import { stages } from '@/data/stages';

const HOURS = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
const START_HOUR = 12;
const TOTAL_HOURS = 11;

function timeToPercent(timeStr: string): number {
  const [timePart, period] = timeStr.split(/(?=[AP]M)/);
  const [h, m = '0'] = timePart.split(':');
  let hour = parseInt(h);
  if (period === 'PM' && hour !== 12) hour += 12;
  const totalMinutes = (hour - START_HOUR) * 60 + parseInt(m);
  return (totalMinutes / (TOTAL_HOURS * 60)) * 100;
}

export default function SchedulePage() {
  const STAGE_ROW_HEIGHT = 120;

  return (
    <main className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Timeline area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden relative px-[24px]">
        <div className="relative" style={{ minWidth: 2140, height: '100%' }}>
          {/* Stage rows */}
          {stages.map((stage, stageIdx) => {
            const stageArtists = artists.filter((a) => a.stageId === stage.id);
            const top = stageIdx * STAGE_ROW_HEIGHT + 60;
            return (
              <div key={stage.id}>
                {/* Stage label */}
                <div
                  className="absolute font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-black"
                  style={{ top, left: 0, lineHeight: '14px' }}
                >
                  {stage.name}
                </div>
                {/* Artist markers */}
                {stageArtists.map((artist) => (
                  <div
                    key={artist.id}
                    className="absolute"
                    style={{
                      left: `${timeToPercent(artist.time)}%`,
                      top: top + 20,
                    }}
                  >
                    <div
                      className={`font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] ${
                        artist.isLive ? 'text-red' : 'text-black'
                      }`}
                    >
                      {artist.name}
                    </div>
                    {artist.isLive && (
                      <div className="mt-[4px] bg-red px-[8px] py-[2px] inline-block">
                        <span className="font-[family-name:var(--font-ui)] text-[16px] text-white uppercase tracking-[-0.64px]">
                          LIVE
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Hour columns + time labels */}
          {HOURS.map((hour, i) => {
            const leftPct = (i / TOTAL_HOURS) * 100;
            return (
              <div
                key={hour}
                className="absolute top-0 bottom-0"
                style={{ left: `${leftPct}%` }}
              >
                {/* Vertical dashed line */}
                <div className="absolute top-0 bottom-[40px] w-px border-l border-dashed border-[#d0d0d0]" />
                {/* Time label at bottom */}
                <div
                  className="absolute bottom-[20px] font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-black"
                  style={{ transform: 'translateX(-50%)' }}
                >
                  {hour}
                </div>
              </div>
            );
          })}

          {/* Horizontal rule above time labels */}
          <div className="absolute bottom-[40px] left-0 right-0 h-px bg-black" />
        </div>
      </div>

      {/* Bottom: SCHEDULE title + date selector */}
      <div className="flex items-end px-[24px] pb-[16px] gap-[40px] h-[134px] flex-shrink-0 border-t border-[#d0d0d0]">
        <h1
          className="text-red uppercase leading-none"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '80px',
            lineHeight: '0.855',
            fontWeight: 600,
          }}
        >
          SCHEDULE
        </h1>
        <div className="ml-auto flex items-end gap-[16px]">
          <span
            className="text-red uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '60px',
              lineHeight: '0.855',
              fontWeight: 600,
            }}
          >
            SAT 6.23
          </span>
          <span
            className="text-[#d0d0d0] uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '50px',
              lineHeight: '0.855',
              fontWeight: 600,
            }}
          >
            SUN 6.24
          </span>
        </div>
      </div>
    </main>
  );
}
