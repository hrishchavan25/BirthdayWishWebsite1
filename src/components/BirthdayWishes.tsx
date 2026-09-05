import React, { useState, useEffect } from 'react';
import { BirthdayWish } from '../types';
import { DEFAULT_WISHES } from '../data/memories';
import { Heart, Send, Sparkles, User, MessageCircle, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioSynth';
import { useSharedStorage } from '../utils/sharedStorage';

const STORAGE_KEY = 'ts_birthday_wishes_v1';

interface BirthdayWishesProps {
  bestieName: string;
}

export const BirthdayWishes: React.FC<BirthdayWishesProps> = ({ bestieName }) => {
  const [wishes, setWishes] = useSharedStorage(STORAGE_KEY, DEFAULT_WISHES);

  const [author, setAuthor] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [tag, setTag] = useState('Best Friend');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    const newWish: BirthdayWish = {
      id: `wish-${Date.now()}`,
      author: author.trim(),
      relation: relation.trim() || 'Cherished Friend',
      message: message.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      tag: tag || 'Heartfelt Wish'
    };

    setWishes([newWish, ...wishes]);
    setAuthor('');
    setRelation('');
    setMessage('');

    audioEngine.playSparkleChime();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#BE123C', '#FDA4AF', '#FDE047']
    });
  };

  return (
    <section id="wishes-section" className="py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 backdrop-blur-md mb-3 border border-pink-300/80 shadow-2xs">
            <MessageCircle className="w-3.5 h-3.5 text-[#db2777]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-900 font-sans">
              Guestbook & Wishes
            </span>
          </div>

          <h2 className="font-script text-5xl sm:text-6xl md:text-7xl text-[#db2777] leading-tight mb-3">
            Birthday Love & Messages
          </h2>

          <p className="font-editorial italic text-xl sm:text-2xl text-pink-950 mb-3">
            Write your personalized wish for {bestieName} to read and cherish on her special day.
          </p>
        </div>

        {/* Message Form & Wish Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Write a Wish Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-pink-200 shadow-sm sticky top-24">
              <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-1">
                Write a Birthday Wish
              </h3>
              <p className="text-xs font-sans text-pink-900/70 mb-5">
                Your message will be posted onto her birthday wall.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3.5 font-sans text-xs">
                <div>
                  <label className="font-bold text-pink-900 uppercase tracking-wider block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Your Bestie"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-pink-900 uppercase tracking-wider block mb-1">
                    Your Relationship / Nickname
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Best Friend for 11 Years"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-pink-900 uppercase tracking-wider block mb-1">
                    Heartfelt Birthday Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={`Write your sweetest birthday message for ${bestieName}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 bg-white outline-none resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!author.trim() || !message.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#db2777] text-white font-semibold text-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Birthday Wish</span>
                </button>
              </form>
            </div>
          </div>

          {/* Wishes List */}
          <div className="lg:col-span-7 space-y-4">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-pink-200/90 shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="font-editorial text-xl font-bold text-stone-900 leading-tight">
                      {w.author}
                    </h4>
                    <p className="text-xs font-sans font-medium text-pink-700">
                      {w.relation}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-sans font-semibold bg-pink-100 text-pink-900 border border-pink-200">
                    {w.tag}
                  </span>
                </div>

                <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                  &ldquo;{w.message}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[11px] font-sans text-pink-900/60 pt-3 border-t border-pink-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {w.date}
                  </span>
                  <div className="flex items-center gap-1 text-[#db2777]">
                    <Heart className="w-3 h-3 fill-[#db2777]" />
                    <span className="font-medium">11 Years of Love</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
