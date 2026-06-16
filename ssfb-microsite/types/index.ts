export type Stage = {
  id: string;
  name: string;
  label: string;
  isLive: boolean;
  liveArtist?: string;
};

export type Artist = {
  id: string;
  stageId: string;
  name: string;
  time: string;
  endTime?: string;
  coverImage: string;
  bio: string;
  isLive: boolean;
};

export type Track = {
  id: string;
  artistId: string;
  title: string;
  duration: string;
  audioSrc?: string;
};
