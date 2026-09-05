import React, { useState } from 'react';
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
import { useSharedStorage } from './utils/sharedStorage';

const NAME_STORAGE_KEY = 'ts_birthday_bestie_name_v1';

export function App() {
  const [bestieName, setBestieName] = useSharedStorage(NAME_STORAGE_KEY, 'Vishiiiii');

  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
