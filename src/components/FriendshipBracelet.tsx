import React, { useState, useEffect } from 'react';
import { FriendshipBraceletItem } from '../types';
import { DEFAULT_BRACELETS } from '../data/memories';
import { Plus, Trash2, Sparkles, Heart, Check, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioSynth';

const STORAGE_KEY = 'ts_birthday_bracelets_v1';

export const FriendshipBracelet: React.FC = () => {
  const [bracelets, setBracelets] = useState<FriendshipBraceletItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_BRACELETS;
  });

  const [customText, setCustomText] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<FriendshipBraceletItem['colorScheme']>('rose');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bracelets));
    } catch (e) {
      console.error(e);
    }
  }, [bracelets]);

  const handleAddBracelet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const newBracelet: FriendshipBraceletItem = {
      id: `bracelet-${Date.now()}`,
      text: customText.toUpperCase().trim().slice(0, 22),
      colorScheme: selectedScheme,
      charm: '✨'
    };

    setBracelets([newBracelet, ...bracelets]);
    setCustomText('');

    audioEngine.playSparkleChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F43F5E', '#FDA4AF', '#FDE047']
    });
  };

  const handleDelete = (id: string) => {
    setBracelets(bracelets.filter(b => b.id !== id));
  };

  const handleCopy = (b: FriendshipBraceletItem) => {
    navigator.clipboard.writeText(`✨ Friendship Bracelet: [ ${b.text} ] • 11 Years Strong ✨`);
    setCopiedId(b.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSchemeStyles = (scheme: FriendshipBraceletItem['colorScheme']) => {
    switch (scheme) {
      case 'rose':
        return {
          bg: 'from-pink-200 via-rose-100 to-pink-200',
          border: 'border-pink-300',
          beadColor: 'bg-white text-pink-950 border-pink-300',
          accent: 'bg-pink-400'
        };
      case 'pearl':
        return {
          bg: 'from-pink-50 via-white to-pink-100',
          border: 'border-pink-200',
          beadColor: 'bg-white text-pink-900 border-pink-200 shadow-2xs',
          accent: 'bg-pink-300'
        };
      case 'gold':
        return {
          bg: 'from-amber-100 via-pink-100 to-rose-100',
          border: 'border-amber-200',
          beadColor: 'bg-amber-50 text-amber-950 border-amber-300',
          accent: 'bg-amber-400'
        };
      case 'lavender':
        return {
          bg: 'from-purple-100 via-pink-100 to-fuchsia-100',
          border: 'border-purple-200',
          beadColor: 'bg-purple-50 text-purple-950 border-purple-300',
          accent: 'bg-purple-400'
        };
      case 'champagne':
        return {
          bg: 'from-pink-100 via-rose-50 to-pink-100',
          border: 'border-pink-200',
          beadColor: 'bg-white text-pink-900 border-pink-200',
          accent: 'bg-pink-300'
        };
      case 'emerald':
        return {
          bg: 'from-emerald-100 via-pink-50 to-teal-100',
          border: 'border-emerald-200',
          beadColor: 'bg-emerald-50 text-emerald-950 border-emerald-300',
          accent: 'bg-emerald-400'
        };
    }
  };

  return (
    <section id="bracelets-section" className="py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 backdrop-blur-md mb-3 border border-pink-300/80 shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-[#db2777] fill-[#db2777]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-900 font-sans">
              Timeless Keepsakes
            </span>
          </div>

          <h2 className="font-script text-5xl sm:text-6xl md:text-7xl text-[#db2777] leading-tight mb-3">
            Friendship Keepsake Bracelets
          </h2>

          <p className="font-editorial italic text-xl sm:text-2xl text-pink-950 mb-3">
            &ldquo;Craft custom bracelets inspired by our 11 years of inside jokes and memories&rdquo;
          </p>

          <p className="font-sans text-xs sm:text-sm text-pink-900/80 max-w-md mx-auto">
            Design a beaded friendship keepsake with special words, anniversary dates, or personalized dedications.
          </p>
        </div>

        {/* Bracelet Builder Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200/80 shadow-sm max-w-2xl mx-auto mb-12">
          <form onSubmit={handleAddBracelet} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-pink-900 uppercase tracking-wider block mb-2 font-sans">
                Bracelet Letters / Phrase
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={22}
                  placeholder="e.g. BESTIE 11 YRS"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                  className="flex-1 text-sm font-sans tracking-widest uppercase px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 bg-white outline-none"
                />
                <button
                  type="submit"
                  disabled={!customText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#db2777] text-white font-sans text-xs font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </button>
              </div>
            </div>

            {/* Color Palette Selector */}
            <div>
              <span className="text-[11px] font-bold text-pink-800 uppercase tracking-wider block mb-2 font-sans">
                Bead Aesthetic
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'rose', name: 'Baby Pink' },
                  { id: 'pearl', name: 'Pure Pearl' },
                  { id: 'gold', name: 'Champagne' },
                  { id: 'lavender', name: 'Lilac' },
                  { id: 'champagne', name: 'Blush Silk' },
                  { id: 'emerald', name: 'Sage Stone' }
                ].map((palette) => (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => setSelectedScheme(palette.id as FriendshipBraceletItem['colorScheme'])}
                    className={`py-2 px-2 text-center rounded-xl border text-[11px] font-sans font-medium transition-all cursor-pointer ${
                      selectedScheme === palette.id
                        ? 'border-[#db2777] bg-pink-100 text-[#db2777] font-bold'
                        : 'border-pink-200 text-stone-600 hover:bg-pink-50'
                    }`}
                  >
                    {palette.name}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* BRACELETS DISPLAY LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bracelets.map((b) => {
            const styles = getSchemeStyles(b.colorScheme);
            const characters = b.text.split('');

            return (
              <div
                key={b.id}
                className={`bg-gradient-to-r ${styles.bg} p-5 rounded-3xl border ${styles.border} shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group`}
              >
                {/* Bead String Graphic */}
                <div className="py-4 flex flex-wrap items-center justify-center gap-1 min-h-[70px]">
                  {characters.map((char, index) => {
                    if (char === ' ') {
                      return (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${styles.accent} mx-1 opacity-60`}
                        />
                      );
                    }
                    return (
                      <div
                        key={index}
                        className={`w-7 h-7 rounded-lg ${styles.beadColor} border flex items-center justify-center font-sans font-bold text-xs shadow-2xs transform transition-transform hover:scale-110`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>

                {/* Bracelet Card Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-black/5 text-xs font-sans">
                  <span className="font-semibold text-stone-700 tracking-wider">
                    {b.text}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(b)}
                      className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-stone-600 hover:text-[#be123c] transition-colors"
                      title="Copy bracelet"
                      aria-label="Copy bracelet text"
                    >
                      {copiedId === b.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-stone-400 hover:text-red-600 transition-colors"
                      title="Delete"
                      aria-label="Delete bracelet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
