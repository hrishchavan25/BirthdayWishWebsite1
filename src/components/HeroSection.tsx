import React, { useState } from 'react';
import { Heart, Sparkles, Music, Cake, Edit3, Check, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioSynth';

interface HeroSectionProps {
  bestieName: string;
  onUpdateBestieName: (name: string) => void;
  onOpenLetter: () => void;
  onPlayBirthdaySong: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  bestieName,
  onUpdateBestieName,
  onOpenLetter,
  onPlayBirthdaySong
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(bestieName);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateBestieName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleCelebrate = () => {
    audioEngine.playSparkleChime();

    const count = 180;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#BE123C', '#E11D48', '#FDA4AF', '#FDE047', '#FFF']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero-section"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 overflow-hidden flex flex-col items-center justify-center text-center"
    >
      {/* Refined Baby Pink Ambient Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[88vw] max-w-5xl h-[440px] bg-gradient-to-r from-pink-300/35 via-rose-200/40 to-pink-100/45 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Heading */}
      <header className="max-w-4xl mx-auto mb-6 z-10">
        <h1 className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#db2777] leading-[1.08] tracking-wide mb-2">
          Happy Birthday
        </h1>

        {/* Bestie Name with Customizer */}
        <div className="flex items-center justify-center gap-2 mt-1 mb-4">
          {isEditingName ? (
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-pink-300">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="font-script text-3xl sm:text-5xl text-[#db2777] bg-white px-4 py-1 rounded-xl outline-none border border-pink-200 text-center"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="p-2 rounded-xl bg-[#db2777] text-white hover:bg-pink-700 transition-all cursor-pointer shadow-xs"
                title="Save Name"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div
              className="group inline-flex items-center gap-2 cursor-pointer"
              onClick={() => setIsEditingName(true)}
              title="Click to change name"
            >
              <span className="font-pinyon text-4xl sm:text-6xl md:text-7xl text-[#9d174d] italic font-semibold hover:opacity-90 transition-opacity">
                {bestieName}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-pink-100 text-pink-700 transition-all"
                title="Edit name"
                aria-label="Edit name"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <p className="font-editorial italic text-xl sm:text-2xl md:text-3xl text-pink-950 max-w-2xl mx-auto mt-4 leading-relaxed">
          &ldquo;Through every season and milestone, having you as my best friend has been life&apos;s greatest gift.&rdquo;
        </p>
      </header>

      {/* Narrative Intro */}
      <p className="font-sans text-sm sm:text-base text-pink-900/80 max-w-2xl mx-auto mb-9 leading-relaxed">
        Celebrating <span className="font-semibold text-[#db2777]">11 years of radiant sisterhood</span>, heartfelt late-night talks, 
        unbreakable bonds, and infinite shared memories. Here is a tribute to you on your special day.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
        <button
          onClick={handleCelebrate}
          className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#f472b6] via-[#ec4899] to-[#db2777] text-white font-sans font-bold text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer border border-pink-200/50"
          id="hero-celebrate-btn"
        >
          <PartyPopper className="w-5 h-5 text-pink-100" />
          <span>Celebrate With Confetti</span>
        </button>

        <button
          onClick={() => {
            scrollTo('birthday-song-section');
            onPlayBirthdaySong();
          }}
          className="px-6 sm:px-7 py-3.5 rounded-full bg-white/85 backdrop-blur-md text-pink-950 hover:text-[#db2777] font-sans font-semibold text-sm sm:text-base shadow-2xs hover:shadow-sm hover:border-pink-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-pink-200"
          id="hero-listen-songs-btn"
        >
          <Music className="w-5 h-5 text-[#db2777]" />
          <span>Play Birthday Song</span>
        </button>

        <button
          onClick={onOpenLetter}
          className="px-6 py-3.5 rounded-full bg-white/75 backdrop-blur-md text-pink-950 hover:text-[#db2777] font-sans font-medium text-sm sm:text-base shadow-2xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-pink-200"
          id="hero-read-letter-btn"
        >
          <Heart className="w-4 h-4 text-[#db2777] fill-[#db2777]" />
          <span>Open Birthday Letter</span>
        </button>
      </div>

      {/* 11-Year Quick Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl w-full text-left">
        {/* The Friendship Stats Card */}
        <div className="md:col-span-3 bg-white/80 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-pink-200/80 shadow-sm">
          <h3 className="text-pink-800 text-xs uppercase tracking-[0.25em] mb-4 border-b border-pink-100 pb-2.5 font-sans font-semibold">
            Friendship Milestone Overview
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-3xl sm:text-4xl text-[#db2777] font-script">11 Years</p>
              <p className="text-[10px] text-pink-700 uppercase tracking-wider font-sans font-semibold mt-0.5">Of Sisterhood</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl text-[#db2777] font-script">4,015 Days</p>
              <p className="text-[10px] text-pink-700 uppercase tracking-wider font-sans font-semibold mt-0.5">Shared Memories</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl text-[#db2777] font-script">Infinite</p>
              <p className="text-[10px] text-pink-700 uppercase tracking-wider font-sans font-semibold mt-0.5">Joy & Laughter</p>
            </div>
          </div>
        </div>

        {/* Highlight Quote Accent Card in Baby Pink Gradient */}
        <div className="bg-gradient-to-br from-[#f472b6] via-[#ec4899] to-[#db2777] text-white p-6 sm:p-7 rounded-3xl shadow-md flex flex-col justify-center border border-pink-200/40">
          <p className="font-editorial italic text-base leading-relaxed text-pink-50">
            &ldquo;True friendship stands the test of time and only grows sweeter with every passing year.&rdquo;
          </p>
          <span className="text-[10px] uppercase tracking-widest text-pink-100 mt-2 font-sans font-semibold">
            11th Year Milestone
          </span>
        </div>
      </div>
    </section>
  );
};
