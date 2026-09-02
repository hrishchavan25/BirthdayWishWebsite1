import React from 'react';
import { Heart, Cake, ArrowUp, Music } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioSynth';

interface FooterProps {
  bestieName: string;
  onPlaySong: () => void;
}

export const Footer: React.FC<FooterProps> = ({ bestieName, onPlaySong }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCelebrate = () => {
    audioEngine.playSparkleChime();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.9 },
      colors: ['#BE123C', '#E11D48', '#FDA4AF', '#FDE047']
    });
  };

  return (
    <footer className="bg-pink-100/90 text-pink-950 py-16 px-4 sm:px-6 relative overflow-hidden border-t border-pink-200">
      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        {/* Cursive Signature */}
        <div>
          <h2 className="font-script text-5xl sm:text-6xl text-[#db2777] mb-2">
            Forever & Always, {bestieName}
          </h2>
          <p className="font-editorial italic text-lg sm:text-xl text-pink-900/80">
            &ldquo;11 years of radiant memories, and an entire lifetime of sisterhood ahead.&rdquo;
          </p>
        </div>

        {/* Action Buttons in Footer */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onPlaySong}
            className="px-5 py-2.5 rounded-full bg-white text-pink-900 hover:bg-pink-50 border border-pink-300 text-xs font-sans font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Music className="w-3.5 h-3.5 text-[#db2777]" />
            <span>Play Happy Birthday Song</span>
          </button>

          <button
            onClick={handleCelebrate}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f472b6] to-[#db2777] text-white hover:shadow-md text-xs font-sans font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Cake className="w-3.5 h-3.5" />
            <span>Birthday Sparkles</span>
          </button>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-white text-pink-900 hover:text-[#db2777] border border-pink-200 hover:bg-pink-50 transition-all cursor-pointer shadow-xs"
            title="Back to top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-8 border-t border-pink-200 text-xs font-sans text-pink-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-pink-900">
            <span>Crafted with love for the 11th year milestone</span>
            <Heart className="w-3.5 h-3.5 text-[#db2777] fill-[#db2777]" />
          </div>

          <p className="text-[11px] uppercase tracking-widest text-pink-700 font-medium">
            Dedicated with all my heart • Forever Best Friends
          </p>
        </div>
      </div>
    </footer>
  );
};
