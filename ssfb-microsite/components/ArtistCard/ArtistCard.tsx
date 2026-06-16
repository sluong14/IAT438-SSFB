'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Artist } from '@/types';

type Props = {
  artist: Artist;
  stageId: string;
};

export default function ArtistCard({ artist, stageId }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-[360px] h-[387px] cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped((f) => !f)}
    >
      {/* Inner — flip container */}
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Photo area */}
          <div
            className={`flex-1 bg-[#d0d0d0] ${
              artist.isLive
                ? 'border border-red shadow-[0_0_0_1px_#FF0000]'
                : 'border border-[#333]'
            }`}
          />
          {/* Info bar */}
          <div className="h-[56px] bg-black px-[13px] flex flex-col justify-center gap-[2px]">
            <span className="font-[family-name:var(--font-ui)] text-[16px] text-white uppercase tracking-[-0.64px] leading-none">
              {artist.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-ui)] text-[16px] text-white uppercase tracking-[-0.64px] leading-none">
                {artist.time}
              </span>
              {artist.isLive && (
                <span className="font-[family-name:var(--font-ui)] text-[16px] text-red uppercase tracking-[-0.64px] leading-none">
                  · LIVE NOW
                </span>
              )}
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 bg-white border border-[#333] flex flex-col p-[16px]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-[family-name:var(--font-ui)] font-semibold text-[16px] text-black uppercase tracking-[-0.64px] mb-[12px]">
            {artist.name}
          </span>
          <p className="font-[family-name:var(--font-ui)] text-[16px] text-black tracking-[-0.64px] leading-[1.4] flex-1">
            {artist.bio}
          </p>
          <Link
            href={`/stage/${stageId}/${artist.id}`}
            className="w-full h-[40px] bg-red flex items-center justify-center font-[family-name:var(--font-ui)] text-[16px] text-white uppercase tracking-[-0.64px] mt-[16px]"
            onClick={(e) => e.stopPropagation()}
          >
            OPEN SETLIST →
          </Link>
        </div>
      </div>
    </div>
  );
}
