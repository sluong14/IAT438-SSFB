'use client';

import { useState } from 'react';
import { AudioInput } from './AudioInput';
import { Visualizer } from './Visualizer';
import { Wheel } from './Wheel';
import { EQControl } from './EQControl';
import { SoundFilter } from './SoundFilter';
import { Tempo } from './Tempo';

type Props = {
  artistName?: string;
  trackTitle?: string;
};

export function WhipMixer({ artistName, trackTitle }: Props) {
  const [loadedFile, setLoadedFile] = useState<File | null>(null);
  const displayTitle = loadedFile ? loadedFile.name.replace(/\.[^.]+$/, '').toUpperCase() : (trackTitle ?? 'TRACK 1');

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-black text-white">
      {/* Audio input bar */}
      <AudioInput onFileLoaded={setLoadedFile} filename={loadedFile?.name} />

      {/* Main mixer area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left column: Visualizer + Sound Filter */}
        <div className="flex flex-col justify-between p-[24px] w-[180px] flex-shrink-0 gap-[24px]">
          <Visualizer />
          <SoundFilter />
        </div>

        {/* Center: Wheel + controls */}
        <Wheel trackTitle={displayTitle} artistName={artistName} />

        {/* Right column: EQ + Tempo */}
        <div className="flex flex-col justify-between p-[24px] w-[160px] flex-shrink-0 gap-[24px]">
          <EQControl />
          <Tempo />
        </div>
      </div>
    </div>
  );
}
