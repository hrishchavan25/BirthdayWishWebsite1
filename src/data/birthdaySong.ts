import { BirthdaySong } from '../types';

export const HAPPY_BIRTHDAY_SONG: BirthdaySong = {
  id: 'happy-birthday-special',
  title: 'Happy Birthday to You',
  subtitle: 'Acoustic Piano & Music Box Celebration',
  composer: 'Traditional • Dedicated with Love',
  durationSec: 32,
  durationFormatted: '0:32',
  lyrics: [
    'Happy birthday to you,',
    'Happy birthday to you,',
    'Happy birthday dear best friend,',
    'Happy birthday to you!',
    'From our very first year to year eleven,',
    'May all your dreams come true!'
  ],
  personalizedDedication: 'Honoring 11 years of radiant friendship, endless laughs, and unforgettable memories.',
  tempo: 96,
  melodyNotes: [
    // Phrase 1: "Happy birthday to you"
    { note: 'G4', duration: 0.35, chord: ['C3', 'E3', 'G3'] },
    { note: 'G4', duration: 0.25 },
    { note: 'A4', duration: 0.6, chord: ['C3', 'F3', 'A3'] },
    { note: 'G4', duration: 0.6, chord: ['C3', 'E3', 'G3'] },
    { note: 'C5', duration: 0.6, chord: ['F3', 'A3', 'C4'] },
    { note: 'B4', duration: 1.1, chord: ['G2', 'B2', 'D3', 'G3'] },

    // Phrase 2: "Happy birthday to you"
    { note: 'G4', duration: 0.35, chord: ['G2', 'D3', 'G3'] },
    { note: 'G4', duration: 0.25 },
    { note: 'A4', duration: 0.6, chord: ['C3', 'F3', 'A3'] },
    { note: 'G4', duration: 0.6, chord: ['G2', 'B2', 'D3'] },
    { note: 'D5', duration: 0.6, chord: ['G3', 'B3', 'D4'] },
    { note: 'C5', duration: 1.1, chord: ['C3', 'E3', 'G3', 'C4'] },

    // Phrase 3: "Happy birthday dear best friend"
    { note: 'G4', duration: 0.35, chord: ['C3', 'E3', 'G3'] },
    { note: 'G4', duration: 0.25 },
    { note: 'G5', duration: 0.65, chord: ['E3', 'G3', 'C4', 'E4'] },
    { note: 'E5', duration: 0.6, chord: ['C3', 'E3', 'G3'] },
    { note: 'C5', duration: 0.6, chord: ['F3', 'A3', 'C4'] },
    { note: 'B4', duration: 0.55, chord: ['D3', 'F#3', 'A3'] },
    { note: 'A4', duration: 1.0, chord: ['F2', 'C3', 'F3', 'A3'] },

    // Phrase 4: "Happy birthday to you!"
    { note: 'F5', duration: 0.35, chord: ['F3', 'A3', 'C4'] },
    { note: 'F5', duration: 0.25 },
    { note: 'E5', duration: 0.6, chord: ['C3', 'G3', 'C4'] },
    { note: 'C5', duration: 0.6, chord: ['E3', 'G3', 'C4'] },
    { note: 'D5', duration: 0.65, chord: ['G2', 'D3', 'G3', 'B3'] },
    { note: 'C5', duration: 1.4, chord: ['C2', 'G2', 'C3', 'E3', 'G3', 'C4'] }
  ]
};
