'use client';

// Setlist + mixer page: /stage/[stageId]/[artistId]
import { notFound } from 'next/navigation';
import { stages } from '@/data/stages';
import { artists, tracks } from '@/data/artists';
import { WhipMixer } from '@/components/WhipMixer/WhipMixer';
import NavStrip from '@/components/NavStrip/NavStrip';

export default function SetlistPage({
  params,
}: {
  params: { stageId: string; artistId: string };
}) {
  const stage = stages.find((s) => s.id === params.stageId);
  const artist = artists.find((a) => a.id === params.artistId);
  if (!stage || !artist) notFound();

  const stageArtists = artists.filter((a) => a.stageId === params.stageId);
  const artistIndex = stageArtists.findIndex((a) => a.id === params.artistId);
  const prevArtist = artistIndex > 0 ? stageArtists[artistIndex - 1] : null;
  const nextArtist = artistIndex < stageArtists.length - 1 ? stageArtists[artistIndex + 1] : null;
  const otherStages = stages.filter((s) => s.id !== params.stageId);

  const artistTracks = tracks.filter((t) => t.artistId === params.artistId);
  const firstTrack = artistTracks[0];

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-black">
      {/* Mixer */}
      <WhipMixer
        artistName={artist.name}
        trackTitle={firstTrack?.title ?? 'TRACK 1'}
      />

      {/* NavStrip */}
      <NavStrip
        currentStage={stage.label}
        currentStageId={stage.id}
        currentArtist={artist.name}
        artistTime={artist.time}
        prevArtist={prevArtist?.name}
        prevArtistId={prevArtist?.id}
        nextArtist={nextArtist?.name}
        nextArtistId={nextArtist?.id}
        otherStages={otherStages.map((s) => ({ label: s.label, id: s.id }))}
      />
    </div>
  );
}
