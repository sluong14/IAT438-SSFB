'use client';

import Link from 'next/link';

type NavStripProps = {
  currentStage?: string;
  currentStageId?: string;
  liveInfo?: string;
  otherStages?: { label: string; id: string }[];
  prevArtist?: string;
  prevArtistId?: string;
  nextArtist?: string;
  nextArtistId?: string;
  currentArtist?: string;
  artistTime?: string;
};

function Chip({
  children,
  variant = 'black',
  href,
}: {
  children: React.ReactNode;
  variant?: 'black' | 'dark-red';
  href?: string;
}) {
  const base =
    'h-[26px] flex items-center px-[13px] font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] whitespace-nowrap rounded-[2px]';
  const colors =
    variant === 'black'
      ? 'bg-black text-red'
      : 'bg-red-dark text-red-muted';

  if (href) {
    return (
      <Link href={href} className={`${base} ${colors}`}>
        {children}
      </Link>
    );
  }
  return <div className={`${base} ${colors}`}>{children}</div>;
}

function Connector() {
  return <div className="h-px w-6 bg-[#454545] flex-shrink-0" />;
}

export default function NavStrip({
  currentStage,
  currentStageId,
  liveInfo,
  otherStages = [],
  prevArtist,
  prevArtistId,
  nextArtist,
  nextArtistId,
  currentArtist,
  artistTime,
}: NavStripProps) {
  const isSetlistMode = !!(currentArtist);

  return (
    <div className="w-full h-[46px] flex items-center px-[34px] gap-0 border-t border-[#454545] flex-shrink-0">
      {/* Left: current stage */}
      {currentStage && currentStageId && (
        <>
          <Chip href={`/stage/${currentStageId}`}>{currentStage}</Chip>
          <Connector />
        </>
      )}

      {/* Setlist mode: prev → current → next */}
      {isSetlistMode && (
        <>
          {prevArtist && prevArtistId && currentStageId && (
            <>
              <Chip href={`/stage/${currentStageId}/${prevArtistId}`} variant="dark-red">
                {prevArtist}
              </Chip>
              <Connector />
            </>
          )}
          <Chip variant="dark-red">
            {currentArtist}&nbsp;&nbsp;{artistTime}
          </Chip>
          {nextArtist && nextArtistId && currentStageId && (
            <>
              <Connector />
              <Chip href={`/stage/${currentStageId}/${nextArtistId}`} variant="dark-red">
                {nextArtist}
              </Chip>
            </>
          )}
        </>
      )}

      {/* Stage artists mode: live info */}
      {!isSetlistMode && liveInfo && (
        <Chip variant="dark-red">{liveInfo}</Chip>
      )}

      {/* Right: other stages */}
      <div className="ml-auto flex items-center gap-[8px]">
        {otherStages.map((s) => (
          <Chip key={s.id} href={`/stage/${s.id}`}>{s.label}</Chip>
        ))}
      </div>
    </div>
  );
}
