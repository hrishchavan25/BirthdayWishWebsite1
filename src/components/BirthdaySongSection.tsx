import React, { useState, useEffect } from 'react';
import { HAPPY_BIRTHDAY_SONG } from '../data/birthdaySong';
import { audioEngine, SoundMood } from '../utils/audioSynth';
import { Play, Pause, Disc, Volume2, Music, Sparkles, Repeat, Heart, Cake } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BirthdaySongSectionProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  bestieName: string;
}

export const BirthdaySongSection: React.FC<BirthdaySongSectionProps> = ({
  isPlaying,
  onTogglePlay,
  bestieName
}) => {
  const song = HAPPY_BIRTHDAY_SONG;
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [eqBars, setEqBars] = useState<number[]>(Array(16).fill(8));
  const [selectedMood, setSelectedMood] = useState<SoundMood>('piano');
  const [isLooping, setIsLooping] = useState<boolean>(true);

  useEffect(() => {
    audioEngine.onTimeUpdate((time) => {
      setCurrentTimeSec(time);
    });

    let animationFrameId: number;
    const updateEQ = () => {
      if (audioEngine.getIsPlaying()) {
        const freq = audioEngine.getFrequencyData();
        setEqBars(freq.map(f => Math.max(8, (f / 255) * 44)));
      } else {
        setEqBars(prev => prev.map(val => Math.max(6, val * 0.85)));
      }
      animationFrameId = requestAnimationFrame(updateEQ);
    };

    animationFrameId = requestAnimationFrame(updateEQ);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
  };

  const handleMoodSelect = (mood: SoundMood) => {
    setSelectedMood(mood);
    audioEngine.setSoundMood(mood);
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  const handleToggleLoop = () => {
    const newLoop = !isLooping;
    setIsLooping(newLoop);
    audioEngine.setLoop(newLoop);
  };

  const handleSingAlong = () => {
    if (!isPlaying) {
      onTogglePlay();
    }
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.75 },
      colors: ['#F43F5E', '#FB7185', '#FDA4AF', '#FDE047', '#FFF']
    });
  };

  const formatSec = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const rem = Math.floor(seconds % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <section id="birthday-song-section" className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Soft Baby Pink Glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-pink-200/35 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 backdrop-blur-md mb-3 border border-pink-300/80 shadow-xs">
            <Cake className="w-3.5 h-3.5 text-[#db2777]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-900 font-sans">
              The Birthday Anthem
            </span>
          </div>

          <h2 className="font-script text-5xl sm:text-6xl md:text-7xl text-[#db2777] leading-tight mb-3">
            Happy Birthday Song
          </h2>

          <p className="font-editorial italic text-xl sm:text-2xl text-pink-950 mb-3">
            &ldquo;May this melody bring as much joy as you have brought into my life for 11 years&rdquo;
          </p>

          <p className="font-sans text-xs sm:text-sm text-pink-900/80 max-w-lg mx-auto">
            Press play to listen to her custom Happy Birthday arrangement, choose your favorite musical arrangement, and celebrate together!
          </p>
        </div>

        {/* ELEGANT MASTER PLAYER CARD */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-pink-200/80 shadow-xl relative overflow-hidden max-w-4xl mx-auto">
          {/* Subtle Ambient Accent */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-pink-300/35 via-rose-200/25 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Classic Elegant Disc Visual */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
              <div className="relative group">
                <div
                  className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-[#1C1917] p-2.5 shadow-2xl flex items-center justify-center border-4 border-pink-950/40 relative transition-transform duration-700 ${
                    isPlaying ? 'animate-spin-slow' : ''
                  }`}
                >
                  {/* Subtle Vinyl Grooves */}
                  <div className="absolute inset-4 rounded-full border border-pink-900/30" />
                  <div className="absolute inset-8 rounded-full border border-pink-900/20" />
                  <div className="absolute inset-12 rounded-full border border-pink-900/15" />

                  {/* Center Label */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-pink-200 via-pink-100 to-rose-100 border-2 border-pink-300 shadow-inner flex flex-col items-center justify-center p-2 text-center relative z-10">
                    <Heart className="w-5 h-5 text-[#db2777] fill-[#db2777]" />
                    <span className="font-script text-base text-[#9d174d] leading-none mt-1">
                      11 Years
                    </span>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-pink-700">
                      Celebration
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white text-[#db2777] border border-pink-200 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-pink-500 animate-pulse' : 'bg-pink-300'}`} />
                  <span>{isPlaying ? 'Playing Now' : 'Ready to Play'}</span>
                </div>
              </div>

              {/* Musical Mood Selectors */}
              <div className="mt-8 w-full">
                <span className="block text-[11px] font-bold uppercase tracking-widest text-pink-900 mb-2 font-sans">
                  Select Arrangement Style
                </span>
                <div className="inline-flex rounded-2xl bg-pink-100/75 p-1 border border-pink-200/90">
                  <button
                    onClick={() => handleMoodSelect('piano')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer ${
                      selectedMood === 'piano'
                        ? 'bg-[#db2777] text-white shadow-xs'
                        : 'text-pink-900 hover:bg-white/60'
                    }`}
                  >
                    Piano Acoustic
                  </button>
                  <button
                    onClick={() => handleMoodSelect('musicbox')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer ${
                      selectedMood === 'musicbox'
                        ? 'bg-[#db2777] text-white shadow-xs'
                        : 'text-pink-900 hover:bg-white/60'
                    }`}
                  >
                    Music Box
                  </button>
                  <button
                    onClick={() => handleMoodSelect('waltz')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer ${
                      selectedMood === 'waltz'
                        ? 'bg-[#db2777] text-white shadow-xs'
                        : 'text-pink-900 hover:bg-white/60'
                    }`}
                  >
                    Gentle Waltz
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Audio Info, EQ, Lyrics, and Controls */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              {/* Title & Dedication */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-pink-700 font-sans">
                    Dedication for {bestieName}
                  </span>

                  {/* Audio Visualizer Waves in Baby Pink */}
                  <div className="flex items-end gap-1 h-6 px-2.5 py-1 bg-pink-50/90 rounded-lg border border-pink-200">
                    {eqBars.map((height, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-[#db2777] to-pink-400 rounded-full transition-all duration-75"
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                  {song.title}
                </h3>
                <p className="text-xs sm:text-sm font-sans text-pink-800/80 mt-1">
                  {song.subtitle} • {song.composer}
                </p>
              </div>

              {/* Lyrics Sing-Along Card */}
              <div className="bg-pink-50/70 rounded-2xl p-4 sm:p-5 border border-pink-200/70">
                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-800 block mb-2 font-sans">
                  Sing-Along Lyrics
                </span>
                <div className="space-y-1.5 font-editorial text-base sm:text-lg text-stone-800 leading-snug">
                  {song.lyrics.map((line, idx) => (
                    <p key={idx} className={idx === 2 ? 'font-bold text-[#db2777]' : ''}>
                      {line.replace('dear best friend', `dear ${bestieName}`)}
                    </p>
                  ))}
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5">
                <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#f472b6] via-[#ec4899] to-[#db2777] h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${Math.min(100, (currentTimeSec / (song.durationSec || 32)) * 100)}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs font-sans text-pink-800 font-medium">
                  <span>{formatSec(currentTimeSec)}</span>
                  <span>{song.durationFormatted}</span>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={onTogglePlay}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-[#f472b6] via-[#ec4899] to-[#db2777] text-white font-sans font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-pink-200/50"
                    id="birthday-song-play-toggle-btn"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-white" />
                        <span>Pause Melody</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                        <span>Play Birthday Song</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSingAlong}
                    className="px-4 py-3 rounded-full bg-white hover:bg-pink-50 text-xs font-bold text-[#db2777] border border-pink-200/90 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#db2777]" />
                    <span>Celebrate</span>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Loop Toggle */}
                  <button
                    onClick={handleToggleLoop}
                    className={`p-2 rounded-full border transition-colors cursor-pointer ${
                      isLooping
                        ? 'bg-pink-100 text-[#db2777] border-pink-300'
                        : 'bg-white text-stone-400 border-stone-200 hover:text-stone-700'
                    }`}
                    title={isLooping ? 'Looping enabled' : 'Looping disabled'}
                    aria-label="Toggle loop"
                  >
                    <Repeat className="w-4 h-4" />
                  </button>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2 text-xs font-sans text-pink-900">
                    <Volume2 className="w-4 h-4 text-[#db2777]" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 accent-[#db2777] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
