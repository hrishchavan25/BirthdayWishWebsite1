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

export type BraceletColorScheme = 
  | 'rose' 
  | 'strawberry' 
  | 'pearl' 
  | 'gold' 
  | 'lavender' 
  | 'champagne' 
  | 'emerald' 
  | 'cotton_candy';

export type BeadShape = 'cube' | 'round' | 'heart' | 'crystal';
export type SpacerStyle = 'star' | 'heart' | 'pearl' | 'gold_rondelle' | 'flower' | 'none';
export type CordStyle = 'pink_silk' | 'gold_chain' | 'silver_sparkle' | 'lavender_satin';

export interface FriendshipBraceletItem {
  id: string;
  text: string;
  colorScheme: BraceletColorScheme;
  charm: string;
  leftCharm?: string;
  rightCharm?: string;
  dangleCharm?: string;
  dangleTag?: string;
  beadShape?: BeadShape;
  spacerStyle?: SpacerStyle;
  cordStyle?: CordStyle;
  charmsList?: string[];
  dedication?: string;
}

export interface BirthdayWish {
  id: string;
  author: string;
  relation: string;
  message: string;
  date: string;
  tag: string;
}
