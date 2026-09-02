export interface BirthdaySong {
  id: string;
  title: string;
  subtitle: string;
  composer: string;
  durationSec: number;
  durationFormatted: string;
  lyrics: string[];
  personalizedDedication: string;
  tempo: number;
  melodyNotes: Array<{ note: string; duration: number; chord?: string[] }>;
}

export interface PolaroidPhoto {
  id: string;
  url: string;
  caption: string;
  year: string;
  location?: string;
  rotationDeg: number;
  tag: string;
  heartColor?: string;
}

export interface FriendshipYear {
  yearNum: number;
  calendarYear: string;
  title: string;
  subtitle: string;
  eraTheme: string;
  eraBadge: string;
  story: string;
  keyMemory: string;
  quote: string;
  photoUrl: string;
  photoCaption: string;
  specialMoments: string[];
  tags: string[];
}

export interface FriendshipBraceletItem {
  id: string;
  text: string;
  colorScheme: 'rose' | 'pearl' | 'gold' | 'lavender' | 'champagne' | 'emerald';
  charm: string;
}

export interface BirthdayWish {
  id: string;
  author: string;
  relation: string;
  message: string;
  date: string;
  tag: string;
}
