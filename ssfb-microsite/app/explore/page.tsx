// Explore page: /explore
// TODO: connect hover on map pins to highlight directory items
import Link from 'next/link';
import { stages } from '@/data/stages';

const FOOD = ['NOORDERLICHT CAFÉ', 'IJVER', 'TRUCK YARD'];
const SERVICES = ['FIRST AID', 'LOCKERS', 'WASHROOM'];

export default function ExplorePage() {
  return (
    <main className="relative flex-1 overflow-hidden">
      {/* Map background — same SVG as home */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/images/2Dmap.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.07,
        }}
      />

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end px-[24px] pb-[24px] h-[220px]">
        {/* Directory listing */}
        <nav className="flex gap-[16px]">
          {/* STAGE column */}
          <div className="w-[200px]">
            <div className="font-[family-name:var(--font-ui)] font-semibold text-[16px] uppercase tracking-[-0.64px] text-black mb-[14px]">
              STAGE
            </div>
            <ul className="flex flex-col gap-[14px]">
              {stages.map((stage) => (
                <li key={stage.id}>
                  <Link
                    href={`/stage/${stage.id}`}
                    className="font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-black hover:text-red transition-colors"
                  >
                    {stage.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* FOOD column */}
          <div className="w-[200px]">
            <div className="font-[family-name:var(--font-ui)] font-semibold text-[16px] uppercase tracking-[-0.64px] text-black mb-[14px]">
              FOOD
            </div>
            <ul className="flex flex-col gap-[14px]">
              {FOOD.map((item) => (
                <li key={item}>
                  <span className="font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-black">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICES column */}
          <div className="w-[200px]">
            <div className="font-[family-name:var(--font-ui)] font-semibold text-[16px] uppercase tracking-[-0.64px] text-black mb-[14px]">
              SERVICES
            </div>
            <ul className="flex flex-col gap-[14px]">
              {SERVICES.map((item) => (
                <li key={item}>
                  <span className="font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-black">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Right: lat/long grid */}
        <div className="ml-auto flex flex-col items-end mb-[8px]">
          <span className="font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-black mb-[4px]">
            LATITUDE · LONGITUDE
          </span>
          <div className="grid grid-cols-3 gap-[2px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-[36px] h-[36px] bg-[#d0d0d0]" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
