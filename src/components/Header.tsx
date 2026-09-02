import React, { useState, useEffect } from 'react';
import { Sparkles, Music2, Heart, Volume2, VolumeX, Play, Pause, Disc } from 'lucide-react';
import { audioEngine } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface HeaderProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenLetter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isPlaying,
  onTogglePlay,
  onOpenLetter
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMute = () => {
    if (isMuted) {
      audioEngine.setVolume(prevVolume || 0.7);
      setIsMuted(false);
    } else {
      setPrevVolume(audioEngine.getVolume());
      audioEngine.setVolume(0);
      setIsMuted(true);
    }
  };

  const triggerHeaderConfetti = () => {
    audioEngine.playSparkleChime();
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.1 },
      colors: ['#F43F5E', '#FDA4AF', '#FDE047', '#FFF']
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-nav-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FFF5F8]/90 backdrop-blur-md shadow-xs border-b border-pink-200/80 py-3'
          : 'bg-[#FFF0F5]/75 backdrop-blur-sm py-4 border-b border-pink-200/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo / Cursive Branding */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer flex items-center gap-3 group"
          id="header-brand-logo"
        >
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-[#db2777] border border-pink-200 group-hover:scale-105 transition-transform shadow-2xs">
            <Heart className="w-4 h-4 fill-[#db2777] text-[#db2777]" />
          </div>
          <div>
            <span className="font-script text-2xl sm:text-3xl font-bold text-[#db2777] tracking-wide block leading-none">
              Forever & Always
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-pink-700 block font-sans">
              11 Years of Friendship
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 font-sans text-xs uppercase tracking-widest font-semibold text-stone-700">
          <button
            onClick={() => scrollToSection('hero-section')}
            className="hover:text-[#db2777] transition-colors cursor-pointer"
            id="nav-link-home"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('timeline-section')}
            className="hover:text-[#db2777] transition-colors cursor-pointer"
            id="nav-link-timeline"
          >
            11 Chapters
          </button>
          <button
            onClick={() => scrollToSection('birthday-song-section')}
            className="hover:text-[#db2777] transition-colors cursor-pointer flex items-center gap-1.5 text-[#db2777]"
            id="nav-link-songs"
          >
            <Music2 className="w-3.5 h-3.5" />
            Birthday Song
          </button>
          <button
            onClick={() => scrollToSection('polaroids-section')}
            className="hover:text-[#db2777] transition-colors cursor-pointer"
            id="nav-link-polaroids"
          >
            Photo Memories
          </button>
          <button
            onClick={() => scrollToSection('bracelets-section')}
            className="hover:text-[#db2777] transition-colors cursor-pointer"
            id="nav-link-bracelets"
          >
            Friendship Bracelets
          </button>
          <button
            onClick={() => scrollToSection('wishes-section')}
            className="hover:text-[#db2777] transition-colors cursor-pointer"
            id="nav-link-wishes"
          >
            Wishes
          </button>
        </nav>

        {/* Actions & Mini Player */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mini Player Pill */}
          <div
            onClick={() => scrollToSection('birthday-song-section')}
            className="bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2.5 text-xs font-medium text-stone-800 shadow-2xs cursor-pointer hover:border-pink-300 transition-all border border-pink-200/90"
            id="header-mini-player"
          >
            <Disc className={`w-4 h-4 text-[#db2777] ${isPlaying ? 'animate-spin-slow' : ''}`} />
            <span className="hidden sm:inline font-sans text-xs font-semibold text-stone-700">Happy Birthday</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlay();
              }}
              className="w-6 h-6 rounded-full bg-[#db2777] text-white flex items-center justify-center hover:bg-pink-700 transition-colors shadow-2xs"
              id="header-play-pause-btn"
              aria-label={isPlaying ? 'Pause song' : 'Play song'}
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white ml-0.5" />}
            </button>
          </div>

          {/* Sound Mute */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-full text-stone-600 hover:bg-pink-100/70 transition-colors cursor-pointer"
            id="header-mute-toggle"
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
            aria-label="Toggle mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#db2777]" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Love Letter Envelope Button */}
          <button
            onClick={onOpenLetter}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ec4899] to-[#db2777] text-white font-sans text-xs font-semibold shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            id="header-open-letter-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-100" />
            <span className="hidden sm:inline">Open Birthday Letter</span>
            <span className="sm:hidden">Letter</span>
          </button>

          {/* Confetti Quick Sparkle */}
          <button
            onClick={triggerHeaderConfetti}
            className="p-2 rounded-full bg-white hover:bg-pink-50 text-[#db2777] border border-pink-200 transition-all cursor-pointer shadow-2xs"
            title="Birthday Sparkles"
            id="header-confetti-btn"
            aria-label="Celebrate sparkles"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
