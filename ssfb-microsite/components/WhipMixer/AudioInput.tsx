'use client';

// This component prompts the user to load an audio file.
// When a file is selected, it will be passed to the Web Audio API chain.
// TODO: connect audioBuffer to WhipMixer controls

type Props = {
  onFileLoaded: (file: File) => void;
  filename?: string;
};

export function AudioInput({ onFileLoaded, filename }: Props) {
  return (
    <div className="flex items-center gap-4 px-[34px] py-[10px] border-b border-[#454545]">
      <label
        htmlFor="audio-upload"
        className="font-[family-name:var(--font-ui)] text-[16px] uppercase tracking-[-0.64px] text-red cursor-pointer hover:text-red-muted transition-colors"
      >
        {filename ? `LOADED: ${filename}` : 'LOAD TRACK — click to import audio file'}
      </label>
      <input
        id="audio-upload"
        type="file"
        accept="audio/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileLoaded(file);
        }}
        className="hidden"
      />
    </div>
  );
}
