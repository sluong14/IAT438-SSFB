'use client';

// Stage artists canvas: /stage/[stageId]
// Pannable canvas with artist cards that flip on click
import { useRef, useState } from 'react';
import { notFound } from 'next/navigation';
import { stages } from '@/data/stages';
import { artists } from '@/data/artists';
import ArtistCard from '@/components/ArtistCard/ArtistCard';
import NavStrip from '@/components/NavStrip/NavStrip';

// Canvas positions matching Figma layout (within 2094×1411 canvas)
const CARD_POSITIONS = [
  { x: 690,  y: 493 },  // LIVE card — center
  { x: 253,  y: 237 },  // top-left
  { x: 954,  y: 43  },  // top-center
  { x: 1416, y: 237 },  // top-right
  { x: 135,  y: 781 },  // bottom-left
  { x: 967,  y: 918 },  // bottom-center
  { x: 1499, y: 781 },  // bottom-right
];

export default function StageArtistsPage({ params }: { params: { stageId: string } }) {
  const stage = stages.find((s) => s.id === params.stageId);
  if (!stage) notFound();

  const stageArtists = artists.filter((a) => a.stageId === params.stageId);
  // Sort so live artist is first (gets the LIVE card position)
  const sorted = [...stageArtists].sort((a, b) => (b.isLive ? 1 : 0) - (a.isLive ? 1 : 0));
  const otherStages = stages.filter((s) => s.id !== params.stageId);

  const [offset, setOffset] = useState({ x: -400, y: -200 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  function onMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('[data-card]')) return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseUp() {
    isDragging.current = false;
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Pannable canvas wrapper */}
      <div
        className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Canvas */}
        <div
          className="absolute"
          style={{
            width: 2094,
            height: 1411,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          {sorted.map((artist, i) => {
            const pos = CARD_POSITIONS[i % CARD_POSITIONS.length];
            return (
              <div
                key={artist.id}
                data-card="true"
                className="absolute"
                style={{ left: pos.x, top: pos.y }}
              >
                <ArtistCard artist={artist} stageId={params.stageId} />
              </div>
            );
          })}
        </div>
      </div>

      {/* NavStrip */}
      <NavStrip
        currentStage={stage.label}
        currentStageId={stage.id}
        liveInfo={stage.liveArtist ? `· LIVE NOW: ${stage.liveArtist}` : undefined}
        otherStages={otherStages.map((s) => ({ label: s.label, id: s.id }))}
      />
    </div>
  );
}
