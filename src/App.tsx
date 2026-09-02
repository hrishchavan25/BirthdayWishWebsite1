import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FriendshipTimeline } from './components/FriendshipTimeline';
import { BirthdaySongSection } from './components/BirthdaySongSection';
import { PhotoCarousel } from './components/PhotoCarousel';
import { FriendshipBracelet } from './components/FriendshipBracelet';
import { BirthdayWishes } from './components/BirthdayWishes';
import { LoveLetterModal } from './components/LoveLetterModal';
import { SparklesEffect } from './components/SparklesEffect';
import { Footer } from './components/Footer';
import { audioEngine } from './utils/audioSynth';

const NAME_STORAGE_KEY = 'ts_birthday_bestie_name_v1';

export function App() {
  const [bestieName, setBestieName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(NAME_STORAGE_KEY);
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return 'My Best Friend';
  });

  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(NAME_STORAGE_KEY, bestieName);
    } catch (e) {
      console.error(e);
    }
  }, [bestieName]);

  const handleUpdateName = (newName: string) => {
    setBestieName(newName);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.playHappyBirthday();
      setIsPlaying(true);
    }
  };

  const handleStartBirthdaySong = () => {
    audioEngine.playHappyBirthday();
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] text-stone-900 selection:bg-pink-200 selection:text-pink-900 relative font-sans">
      {/* Dreamy Ambient Atmospheric Baby Pink Light Halos */}
      <SparklesEffect />

      {/* Main Navigation Header */}
      <Header
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onOpenLetter={() => setIsLetterModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 space-y-4">
        {/* 1. Hero Birthday Celebration */}
        <HeroSection
          bestieName={bestieName}
          onUpdateBestieName={handleUpdateName}
          onOpenLetter={() => setIsLetterModalOpen(true)}
          onPlayBirthdaySong={handleStartBirthdaySong}
        />

        {/* 2. 11 Chapters Friendship Timeline */}
        <FriendshipTimeline />

        {/* 3. The Birthday Song & Audio Player (Happy Birthday to You) */}
        <BirthdaySongSection
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          bestieName={bestieName}
        />

        {/* 4. Photo Memories Polaroid Carousel & Uploader */}
        <PhotoCarousel />

        {/* 5. Friendship Keepsake Bracelets */}
        <FriendshipBracelet />

        {/* 6. Guestbook & Birthday Messages */}
        <BirthdayWishes bestieName={bestieName} />
      </main>

      {/* Footer */}
      <Footer
        bestieName={bestieName}
        onPlaySong={handleStartBirthdaySong}
      />

      {/* Wax-Sealed Birthday Love Letter Modal */}
      <LoveLetterModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        bestieName={bestieName}
      />
    </div>
  );
}

export default App;
