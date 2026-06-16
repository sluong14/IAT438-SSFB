import type { Artist, Track } from '@/types';

export const saturdayArtists: Artist[] = [
  // Stage A — THE REST IS NOISE
  { id: 'tala-drum-corps',           stageId: 'stage-a', name: 'TALA DRUM CORPS',                   time: '1:00PM',  endTime: '2:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'dj-kampire',                stageId: 'stage-a', name: 'DJ KAMPIRE',                         time: '2:00PM',  endTime: '3:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'equiknoxx',                 stageId: 'stage-a', name: 'EQUIKNOXX FEAT. SHANIQUE MARIE',     time: '3:00PM',  endTime: '4:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'oceanic',                   stageId: 'stage-a', name: 'OCEANIC',                            time: '4:00PM',  endTime: '5:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'nihiloxica',                stageId: 'stage-a', name: 'NIHILOXICA',                         time: '6:00PM',  endTime: '7:00PM',  coverImage: '', bio: '', isLive: true  },
  { id: 'dj-marfox',                 stageId: 'stage-a', name: 'DJ MARFOX',                          time: '7:00PM',  endTime: '8:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'mykki-blanco',              stageId: 'stage-a', name: 'MYKKI BLANCO',                       time: '8:00PM',  endTime: '9:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'deena-abdelnahed',          stageId: 'stage-a', name: 'DEENA ABDELNAHED',                   time: '9:00PM',  endTime: '10:00PM', coverImage: '', bio: '', isLive: false },
  { id: 'lanark-artefax',            stageId: 'stage-a', name: 'LANARK ARTEFAX',                     time: '10:00PM', endTime: '11:00PM', coverImage: '', bio: '', isLive: false },

  // Stage B — RED LIGHT RADIO
  { id: 'merel',                     stageId: 'stage-b', name: 'MEREL',                              time: '1:00PM',  endTime: '2:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'les-filles-de-illighadad',  stageId: 'stage-b', name: 'LES FILLES DE ILLIGHADAD',          time: '2:00PM',  endTime: '3:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'lulu-mata-hari',            stageId: 'stage-b', name: 'LULU & MATA HARI',                   time: '3:00PM',  endTime: '4:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'vladimir-ivkovic-a',        stageId: 'stage-b', name: 'VLADIMIR IVKOVIC',                   time: '4:00PM',  endTime: '5:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'nurse-with-wound',          stageId: 'stage-b', name: 'NURSE WITH WOUND',                   time: '5:00PM',  endTime: '6:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'vladimir-ivkovic-b',        stageId: 'stage-b', name: 'VLADIMIR IVKOVIC',                   time: '6:00PM',  endTime: '7:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'zozo',                      stageId: 'stage-b', name: 'ZOZO',                               time: '7:00PM',  endTime: '8:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'orpheu-the-wizard',         stageId: 'stage-b', name: 'ORPHEU THE WIZARD',                  time: '9:00PM',  endTime: '10:00PM', coverImage: '', bio: '', isLive: false },

  // Stage C — TENT
  { id: 'randstad',                  stageId: 'stage-c', name: 'RANDSTAD',                           time: '12:00PM', endTime: '1:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'job-sifre',                 stageId: 'stage-c', name: 'JOB SIFRE',                          time: '2:00PM',  endTime: '3:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'die-wilde-jagd',            stageId: 'stage-c', name: 'DIE WILDE JAGD',                     time: '3:00PM',  endTime: '4:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'dopplereffekt',             stageId: 'stage-c', name: 'DOPPLEREFFEKT',                      time: '4:00PM',  endTime: '5:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'jasss',                     stageId: 'stage-c', name: 'JASSS',                              time: '5:00PM',  endTime: '6:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'alessandro-adriani',        stageId: 'stage-c', name: 'ALESSANDRO ADRIANI & THE HACKER',   time: '6:00PM',  endTime: '8:00PM',  coverImage: '', bio: '', isLive: false },
  { id: 'giant-swan',                stageId: 'stage-c', name: 'GIANT SWAN',                         time: '9:00PM',  endTime: '10:00PM', coverImage: '', bio: '', isLive: false },
  { id: 'i-f',                       stageId: 'stage-c', name: 'I-F',                                time: '10:00PM', endTime: '11:00PM', coverImage: '', bio: '', isLive: false },
];

export const sundayArtists: Artist[] = [];

// Default export keeps existing imports working
export const artists = saturdayArtists;

export const tracks: Track[] = [
  { id: 'track-1', artistId: 'lulu-mata-hari', title: 'TRACK 1', duration: '4:22' },
  { id: 'track-2', artistId: 'lulu-mata-hari', title: 'TRACK 2', duration: '5:11' },
  { id: 'track-3', artistId: 'lulu-mata-hari', title: 'TRACK 3', duration: '3:47' },
];
