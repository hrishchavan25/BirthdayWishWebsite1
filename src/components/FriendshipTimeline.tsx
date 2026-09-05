import React, { useState, useEffect } from 'react';
import { FriendshipYear } from '../types';
import { FRIENDSHIP_YEARS } from '../data/memories';
import { BookOpen, Calendar, Edit3, Check, X, Sparkles, Heart } from 'lucide-react';
import { audioEngine } from '../utils/audioSynth';
import { useSharedStorage } from '../utils/sharedStorage';

const STORAGE_KEY = 'bestie_birthday_chapters_sweet_v2';

export const FriendshipTimeline: React.FC = () => {
  const [years, setYears] = useSharedStorage(STORAGE_KEY, FRIENDSHIP_YEARS);

  const [activeYearModal, setActiveYearModal] = useState<FriendshipYear | null>(null);
  const [editingYear, setEditingYear] = useState<FriendshipYear | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStory, setEditStory] = useState('');
  const [editKeyMemory, setEditKeyMemory] = useState('');
  const [editQuote, setEditQuote] = useState('');

  const handleOpenEdit = (yr: FriendshipYear, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingYear(yr);
    setEditTitle(yr.title);
    setEditStory(yr.story);
    setEditKeyMemory(yr.keyMemory);
    setEditQuote(yr.quote);
  };

  const handleSaveEdit = () => {
    if (!editingYear) return;
    const updated = years.map(y => y.yearNum === editingYear.yearNum ? {
      ...y,
      title: editTitle || y.title,
      story: editStory || y.story,
      keyMemory: editKeyMemory || y.keyMemory,
      quote: editQuote || y.quote
    } : y);

    setYears(updated);
    if (activeYearModal && activeYearModal.yearNum === editingYear.yearNum) {
      setActiveYearModal({
        ...activeYearModal,
        title: editTitle || activeYearModal.title,
        story: editStory || activeYearModal.story,
        keyMemory: editKeyMemory || activeYearModal.keyMemory,
        quote: editQuote || activeYearModal.quote
      });
    }
    setEditingYear(null);
    audioEngine.playSparkleChime();
  };

  return (
    <section id="timeline-section" className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Soft Baby Pink Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[75vw] h-96 bg-pink-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 backdrop-blur-md mb-3 border border-pink-300/80 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-[#db2777]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-900 font-sans">
              Our 11-Year Storybook
            </span>
          </div>
          <h2 className="font-script text-5xl sm:text-6xl md:text-7xl text-[#db2777] leading-tight mb-3">
            11 Chapters of Sisterhood
          </h2>
          <p className="font-editorial italic text-lg sm:text-2xl text-pink-950 mb-3">
            &ldquo;Every year added a new layer of warmth, laughter, and timeless devotion&rdquo;
          </p>
          <p className="font-sans text-xs sm:text-sm text-pink-900/80 max-w-xl mx-auto">
            From our very first encounter to today&apos;s 11th-year birthday celebration — click any chapter to read the memory or personalize it with your own reflections.
          </p>
        </div>

        {/* 11 YEARS TIMELINE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {years.map((yr) => {
            const isToday = yr.yearNum === 11;
            const fitFullPhoto = yr.yearNum === 1 || yr.yearNum === 2 || yr.yearNum === 7;

            return (
              <div
                key={yr.yearNum}
                onClick={() => setActiveYearModal(yr)}
                className={`bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:-translate-y-1 relative group ${
                  isToday
                    ? 'border-pink-400 ring-2 ring-pink-300/60 bg-gradient-to-br from-pink-100/80 via-white/95 to-pink-50/90 shadow-md'
                    : 'border-pink-200/80 hover:bg-white/95 shadow-2xs hover:border-pink-300'
                }`}
                id={`chapter-card-year-${yr.yearNum}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold font-sans border bg-pink-100/90 text-pink-950 border-pink-200">
                      {yr.eraBadge}
                    </span>
                    <span className="font-editorial text-sm font-bold text-[#db2777]">
                      Year {yr.yearNum} of 11
                    </span>
                  </div>

                  {/* Chapter Title */}
                  <h3 className="font-editorial text-2xl font-bold text-stone-900 group-hover:text-[#db2777] transition-colors leading-snug mb-1">
                    {yr.title}
                  </h3>
                  <p className="text-xs font-sans font-semibold text-pink-700 mb-3 uppercase tracking-wider">
                    {yr.subtitle}
                  </p>

                  {/* Brief Story Excerpt */}
                  <p className="text-xs sm:text-sm font-sans text-stone-600 line-clamp-3 leading-relaxed mb-4">
                    {yr.story}
                  </p>
                </div>

                <div>
                  {/* Photo thumbnail */}
                  <div className="h-40 w-full rounded-2xl overflow-hidden mb-3 relative group/img bg-pink-50 border border-pink-100">
                    <img
                      src={yr.photoUrl}
                      alt={yr.title}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full ${fitFullPhoto ? 'object-contain bg-pink-50' : 'object-cover'} group-hover/img:scale-105 transition-transform duration-500`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
                    <span className="absolute bottom-2 left-3 right-3 text-white text-[11px] font-sans font-medium truncate">
                      {yr.photoCaption}
                    </span>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-pink-100">
                    <span className="text-[11px] font-sans text-pink-700 font-semibold group-hover:underline flex items-center gap-1">
                      Read Full Chapter →
                    </span>
                    <button
                      onClick={(e) => handleOpenEdit(yr, e)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#db2777] hover:bg-pink-100 transition-colors"
                      title="Edit this memory"
                      aria-label="Edit memory"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL CHAPTER DETAIL MODAL */}
      {activeYearModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveYearModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-pink-200 max-h-[90vh] overflow-y-auto relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveYearModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-pink-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-[#db2777] border border-pink-200">
                {activeYearModal.eraBadge}
              </span>
              <span className="text-xs font-sans font-bold text-stone-500 uppercase tracking-wider">
                {activeYearModal.calendarYear}
              </span>
            </div>

            <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 mb-1">
              {activeYearModal.title}
            </h3>
            <p className="text-sm font-sans font-semibold text-pink-700 mb-6 uppercase tracking-wider">
              {activeYearModal.subtitle}
            </p>

            <div className="rounded-2xl overflow-hidden mb-6 h-64 sm:h-72 w-full bg-pink-50 relative border border-pink-100">
              <img
                src={activeYearModal.photoUrl}
                alt={activeYearModal.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full ${activeYearModal.yearNum === 1 || activeYearModal.yearNum === 2 || activeYearModal.yearNum === 7 ? 'object-contain bg-pink-50' : 'object-cover'}`}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-xs sm:text-sm font-sans">
                  {activeYearModal.photoCaption}
                </p>
              </div>
            </div>

            {/* Narrative Story */}
            <div className="space-y-4 text-stone-700 font-sans text-sm sm:text-base leading-relaxed mb-6">
              <p>{activeYearModal.story}</p>
            </div>

            {/* Quote Box */}
            <div className="bg-pink-50/80 p-4 sm:p-5 rounded-2xl border border-pink-200 mb-6">
              <p className="font-editorial italic text-base sm:text-lg text-[#9d174d] leading-relaxed">
                {activeYearModal.quote}
              </p>
            </div>

            {/* Key Memory Highlight */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-widest font-bold text-stone-600 font-sans mb-2">
                Unforgettable Memory
              </h4>
              <p className="text-sm font-sans text-stone-800 bg-pink-50/50 p-3 rounded-xl border border-pink-200/60">
                {activeYearModal.keyMemory}
              </p>
            </div>

            {/* Moments Bullet Points */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-widest font-bold text-stone-600 font-sans mb-2">
                Special Moments
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm font-sans text-stone-600 list-disc list-inside">
                {activeYearModal.specialMoments.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-pink-100">
              <button
                onClick={(e) => {
                  handleOpenEdit(activeYearModal, e);
                }}
                className="text-xs font-semibold text-[#db2777] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Customize this Chapter
              </button>

              <button
                onClick={() => setActiveYearModal(null)}
                className="px-5 py-2 rounded-full bg-[#db2777] text-white text-xs font-semibold hover:bg-pink-700 transition-colors cursor-pointer shadow-2xs"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CHAPTER MODAL */}
      {editingYear && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setEditingYear(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-pink-200 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-editorial text-2xl font-bold text-stone-900">
                Edit Year {editingYear.yearNum} Memory
              </h3>
              <button onClick={() => setEditingYear(null)} className="text-stone-400 hover:text-stone-700" aria-label="Cancel edit">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 font-sans">
              <div>
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-pink-200 focus:border-pink-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  Story & Reflection
                </label>
                <textarea
                  rows={4}
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-pink-200 focus:border-pink-400 outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  Key Memory Highlight
                </label>
                <input
                  type="text"
                  value={editKeyMemory}
                  onChange={(e) => setEditKeyMemory(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-pink-200 focus:border-pink-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  Meaningful Quote
                </label>
                <input
                  type="text"
                  value={editQuote}
                  onChange={(e) => setEditQuote(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-pink-200 focus:border-pink-400 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-pink-100">
              <button
                onClick={() => setEditingYear(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-pink-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-[#db2777] text-white text-xs font-semibold hover:bg-pink-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Check className="w-4 h-4" />
                Save Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
