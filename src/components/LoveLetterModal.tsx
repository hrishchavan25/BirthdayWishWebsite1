import React, { useState, useEffect } from 'react';
import { X, Heart, Edit3, Check, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioSynth';

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  bestieName: string;
}

const STORAGE_KEY = 'ts_birthday_letter_v1';

const DEFAULT_LETTER = `My Dearest Best Friend,

Happy, happy birthday! As I sit here writing this, I genuinely cannot believe we are celebrating ELEVEN WHOLE YEARS of friendship. It feels like just yesterday we were awkwardly getting to know each other, and now you are my sister, my rock, and my absolute favorite human.

Think about everything we have walked through together: 11 years of laughing until our ribs ached, drying each other's tears through life's biggest transitions, singing our hearts out with the car windows rolled down, and knowing that no matter what happened in the outside world, I always had you in my corner.

With you, every single year has been pure warmth and joy. Thank you for never judging me, for always answering my late-night calls, for sending the best messages, and for being the kindest, smartest, and most inspiring person inside and out.

May this birthday bring you everything your heart desires and more. Here is to our 11th year milestone, and to a lifetime of adventures ahead.

With all my love forever & always,
Your Best Friend`;

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({
  isOpen,
  onClose,
  bestieName
}) => {
  const [letterContent, setLetterContent] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_LETTER;
  });

  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(letterContent);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, letterContent);
    } catch (e) {
      console.error(e);
    }
  }, [letterContent]);

  if (!isOpen) return null;

  const handleBreakSeal = () => {
    audioEngine.playSparkleChime();
    setIsEnvelopeOpen(true);
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#BE123C', '#E11D48', '#FDA4AF', '#FDE047']
    });
  };

  const handleSaveEdit = () => {
    setLetterContent(tempContent);
    setIsEditing(false);
    audioEngine.playSparkleChime();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full my-auto animate-scale-up relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
          aria-label="Close letter modal"
        >
          <X className="w-6 h-6" />
        </button>

        {!isEnvelopeOpen ? (
          /* SEALED ENVELOPE VIEW */
          <div
            onClick={handleBreakSeal}
            className="bg-[#FFF0F5] rounded-3xl p-8 sm:p-12 border-2 border-pink-200 shadow-2xl text-center cursor-pointer transform hover:scale-[1.01] transition-all relative overflow-hidden group"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-[#f472b6] to-[#db2777] text-white flex items-center justify-center shadow-lg border-2 border-pink-200 group-hover:rotate-6 transition-transform">
              <Mail className="w-7 h-7" />
            </div>

            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#db2777] font-sans">
              Personal & Confidential • 11 Years Edition
            </span>

            <h3 className="font-script text-5xl sm:text-6xl text-[#db2777] my-2">
              For {bestieName}
            </h3>

            <p className="font-editorial italic text-xl text-pink-950 mb-6">
              A heartfelt birthday letter sealed with 11 years of sisterhood
            </p>

            {/* WAX SEAL BUTTON */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#f472b6] to-[#db2777] text-white font-sans font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all border border-pink-200">
              <Heart className="w-4 h-4 fill-white" />
              <span>Click to Break Wax Seal & Open</span>
            </div>
          </div>
        ) : (
          /* OPENED PARCHMENT LETTER */
          <div className="bg-[#FFF5F8] rounded-3xl p-6 sm:p-10 border border-pink-200 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            {/* Top Stamps & Letterhead */}
            <div className="flex items-center justify-between border-b border-pink-100 pb-4 mb-6">
              <div>
                <span className="font-script text-3xl sm:text-4xl text-[#db2777]">
                  11 Years of Friendship
                </span>
                <p className="font-sans text-[11px] text-[#db2777] font-semibold tracking-wider uppercase">
                  From Your Best Friend Forever
                </p>
              </div>

              {/* Postage Stamp */}
              <div className="w-12 h-14 border-2 border-dashed border-pink-300 rounded p-1 flex flex-col items-center justify-center bg-pink-50 text-[10px] font-sans font-bold text-[#db2777]">
                <span>11 YRS</span>
                <Heart className="w-3.5 h-3.5 fill-[#db2777] text-[#db2777]" />
                <span>2026</span>
              </div>
            </div>

            {/* Letter Body or Editor */}
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  rows={12}
                  value={tempContent}
                  onChange={(e) => setTempContent(e.target.value)}
                  className="w-full font-editorial text-base sm:text-lg text-stone-900 bg-white/90 p-4 rounded-xl border border-pink-200 focus:border-pink-400 outline-none resize-none leading-relaxed"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setTempContent(letterContent);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-sans font-semibold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#db2777] text-white text-xs font-sans font-semibold hover:shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Save Letter
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-editorial text-pink-950 text-base sm:text-lg whitespace-pre-line leading-relaxed space-y-4">
                  {letterContent}
                </div>

                <div className="flex justify-between items-center mt-8 pt-4 border-t border-pink-100">
                  <button
                    onClick={() => {
                      setTempContent(letterContent);
                      setIsEditing(true);
                    }}
                    className="text-xs font-sans font-semibold text-[#db2777] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Customize & Edit Letter
                  </button>

                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#f472b6] to-[#db2777] text-white font-sans text-xs font-semibold hover:shadow-md transition-colors cursor-pointer"
                  >
                    Keep as Keepsake
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
