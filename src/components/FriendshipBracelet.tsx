import React, { useState, useEffect, useRef } from 'react';
import { 
  FriendshipBraceletItem, 
  BraceletColorScheme, 
  BeadShape, 
  SpacerStyle, 
  CordStyle 
} from '../types';
import { DEFAULT_BRACELETS } from '../data/memories';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Heart, 
  Check, 
  Copy, 
  Download, 
  Eye, 
  X, 
  Shuffle, 
  Sliders, 
  Gift, 
  RefreshCw,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioSynth';
import { useSharedStorage } from '../utils/sharedStorage';

const STORAGE_KEY = 'bestie_birthday_bracelets_charms_v2';

const CHARM_OPTIONS = [
  // Sweet Love & Bows
  { id: 'bow', emoji: '🎀', label: 'Coquette Bow', category: 'love' },
  { id: 'heart', emoji: '💖', label: 'Pink Sparkle Heart', category: 'love' },
  { id: 'double_heart', emoji: '💕', label: 'Two Hearts', category: 'love' },
  { id: 'blossom', emoji: '🌸', label: 'Cherry Blossom', category: 'love' },
  { id: 'rose', emoji: '🌹', label: 'Rose', category: 'love' },
  { id: 'tulip', emoji: '🌷', label: 'Tulip', category: 'love' },
  { id: 'letter', emoji: '💌', label: 'Love Letter', category: 'love' },
  { id: 'teddy', emoji: '🧸', label: 'Teddy Bear', category: 'love' },

  // Magic & Celestial
  { id: 'sparkles', emoji: '✨', label: 'Sparkles', category: 'magic' },
  { id: 'star', emoji: '⭐', label: 'Golden Star', category: 'magic' },
  { id: 'moon', emoji: '🌙', label: 'Crescent Moon', category: 'magic' },
  { id: 'dizzy_star', emoji: '💫', label: 'Twinkle Star', category: 'magic' },
  { id: 'diamond', emoji: '💎', label: 'Diamond', category: 'magic' },
  { id: 'mirrorball', emoji: '🪩', label: 'Disco Ball', category: 'magic' },
  { id: 'butterfly', emoji: '🦋', label: 'Butterfly', category: 'magic' },

  // Celebrations & Sweets
  { id: 'cake', emoji: '🎂', label: 'Birthday Cake', category: 'treats' },
  { id: 'cupcake', emoji: '🧁', label: 'Sweet Cupcake', category: 'treats' },
  { id: 'shortcake', emoji: '🍰', label: 'Strawberry Cake', category: 'treats' },
  { id: 'strawberry', emoji: '🍓', label: 'Sweet Berry', category: 'treats' },
  { id: 'crown', emoji: '👑', label: 'Golden Crown', category: 'treats' },
  { id: 'clover', emoji: '🍀', label: 'Lucky Clover', category: 'treats' },
  { id: 'dove', emoji: '🕊️', label: 'Peace Dove', category: 'treats' },
  { id: 'unicorn', emoji: '🦄', label: 'Magic Unicorn', category: 'treats' }
];

const PRESET_PHRASES = [
  'BESTIE 11 YRS',
  'SOUL SISTERS',
  'FOREVER ALWAYS',
  'HAPPY 11TH BDAY',
  'TIMELESS BOND',
  'DAY ONE BESTIE',
  'SWEET SISTER',
  'PARTNERS IN CRIME'
];

const COLOR_SCHEMES: Array<{ id: BraceletColorScheme; name: string; tag: string }> = [
  { id: 'rose', name: 'Baby Pink', tag: 'Blush & Rose Quartz' },
  { id: 'strawberry', name: 'Strawberry Milk', tag: 'Creamy Pink & Berries' },
  { id: 'pearl', name: 'Pure Pearl', tag: 'Iridescent White Sheen' },
  { id: 'gold', name: 'Champagne Gold', tag: 'Golden Warm Shimmer' },
  { id: 'lavender', name: 'Lilac Dreams', tag: 'Pastel Lavender Haze' },
  { id: 'champagne', name: 'Blush Silk', tag: 'Peach & Rose Gold' },
  { id: 'emerald', name: 'Fairy Sage', tag: 'Earthy Mint & Jade' },
  { id: 'cotton_candy', name: 'Cotton Candy', tag: 'Pastel Pink & Sky Blue' }
];

export const FriendshipBracelet: React.FC = () => {
  const [bracelets, setBracelets] = useSharedStorage(STORAGE_KEY, DEFAULT_BRACELETS);

  // Builder States
  const [customText, setCustomText] = useState('BESTIE 11 YRS');
  const [selectedScheme, setSelectedScheme] = useState<BraceletColorScheme>('rose');
  const [beadShape, setBeadShape] = useState<BeadShape>('cube');
  const [spacerStyle, setSpacerStyle] = useState<SpacerStyle>('heart');
  const [cordStyle, setCordStyle] = useState<CordStyle>('pink_silk');
  const [leftCharm, setLeftCharm] = useState<string>('🎀');
  const [rightCharm, setRightCharm] = useState<string>('🌸');
  const [dangleCharm, setDangleCharm] = useState<string>('💖');
  const [dangleTag, setDangleTag] = useState<string>('11 YRS');
  const [activeCharmTab, setActiveCharmTab] = useState<'left' | 'right' | 'dangle'>('dangle');

  // Interactive UI States
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedGiftBracelet, setSelectedGiftBracelet] = useState<FriendshipBraceletItem | null>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Color Styles Helper
  const getSchemeStyles = (scheme: BraceletColorScheme) => {
    switch (scheme) {
      case 'rose':
        return {
          bg: 'from-pink-100 via-rose-50 to-pink-100',
          border: 'border-pink-300',
          beadBg: 'bg-white',
          beadText: 'text-[#be123c]',
          beadBorder: 'border-pink-200',
          cordColor: 'bg-pink-300',
          accent: 'bg-pink-400',
          shadow: 'shadow-pink-100',
          tagBg: 'bg-pink-100 text-pink-900 border-pink-300'
        };
      case 'strawberry':
        return {
          bg: 'from-pink-200 via-pink-100 to-rose-200',
          border: 'border-rose-300',
          beadBg: 'bg-[#FFF8FA]',
          beadText: 'text-[#db2777]',
          beadBorder: 'border-pink-300',
          cordColor: 'bg-rose-400',
          accent: 'bg-rose-500',
          shadow: 'shadow-rose-100',
          tagBg: 'bg-rose-100 text-rose-900 border-rose-300'
        };
      case 'pearl':
        return {
          bg: 'from-slate-50 via-pink-50/50 to-stone-100',
          border: 'border-stone-200',
          beadBg: 'bg-white',
          beadText: 'text-stone-800',
          beadBorder: 'border-stone-200',
          cordColor: 'bg-stone-300',
          accent: 'bg-stone-400',
          shadow: 'shadow-stone-100',
          tagBg: 'bg-stone-100 text-stone-800 border-stone-300'
        };
      case 'gold':
        return {
          bg: 'from-amber-100/80 via-pink-50 to-yellow-100/90',
          border: 'border-amber-300',
          beadBg: 'bg-[#FFFDF5]',
          beadText: 'text-amber-900',
          beadBorder: 'border-amber-300',
          cordColor: 'bg-amber-400',
          accent: 'bg-amber-500',
          shadow: 'shadow-amber-100',
          tagBg: 'bg-amber-100 text-amber-900 border-amber-300'
        };
      case 'lavender':
        return {
          bg: 'from-purple-100 via-pink-50 to-fuchsia-100',
          border: 'border-purple-300',
          beadBg: 'bg-[#FAF5FF]',
          beadText: 'text-purple-900',
          beadBorder: 'border-purple-200',
          cordColor: 'bg-purple-300',
          accent: 'bg-purple-400',
          shadow: 'shadow-purple-100',
          tagBg: 'bg-purple-100 text-purple-900 border-purple-300'
        };
      case 'champagne':
        return {
          bg: 'from-orange-50 via-rose-50 to-pink-100',
          border: 'border-pink-200',
          beadBg: 'bg-[#FFF9F6]',
          beadText: 'text-rose-950',
          beadBorder: 'border-pink-200',
          cordColor: 'bg-rose-300',
          accent: 'bg-rose-400',
          shadow: 'shadow-pink-100',
          tagBg: 'bg-rose-100 text-rose-900 border-rose-200'
        };
      case 'emerald':
        return {
          bg: 'from-emerald-50 via-teal-50 to-emerald-100',
          border: 'border-emerald-200',
          beadBg: 'bg-[#F4FBF7]',
          beadText: 'text-emerald-950',
          beadBorder: 'border-emerald-200',
          cordColor: 'bg-emerald-400',
          accent: 'bg-emerald-500',
          shadow: 'shadow-emerald-100',
          tagBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        };
      case 'cotton_candy':
        return {
          bg: 'from-pink-100 via-purple-50 to-sky-100',
          border: 'border-pink-300',
          beadBg: 'bg-white',
          beadText: 'text-pink-800',
          beadBorder: 'border-pink-200',
          cordColor: 'bg-pink-300',
          accent: 'bg-sky-400',
          shadow: 'shadow-sky-100',
          tagBg: 'bg-sky-100 text-sky-900 border-sky-300'
        };
      default:
        return {
          bg: 'from-pink-100 via-rose-50 to-pink-100',
          border: 'border-pink-300',
          beadBg: 'bg-white',
          beadText: 'text-pink-900',
          beadBorder: 'border-pink-200',
          cordColor: 'bg-pink-300',
          accent: 'bg-pink-400',
          shadow: 'shadow-pink-100',
          tagBg: 'bg-pink-100 text-pink-900 border-pink-300'
        };
    }
  };

  // Render individual bead icon/container based on shape
  const renderBead = (
    char: string,
    idx: number,
    shape: BeadShape = 'cube',
    styles: ReturnType<typeof getSchemeStyles>
  ) => {
    const isSpecialChar = char === ' ' || char === '-' || char === '•';

    if (isSpecialChar) {
      if (spacerStyle === 'heart') {
        return (
          <span 
            key={`spacer-${idx}`} 
            className="text-xs px-0.5 transform scale-90 text-pink-400 animate-pulse"
            title="Heart Spacer"
          >
            💖
          </span>
        );
      }
      if (spacerStyle === 'star') {
        return (
          <span 
            key={`spacer-${idx}`} 
            className="text-xs px-0.5 transform scale-90 text-amber-400"
            title="Star Spacer"
          >
            ⭐
          </span>
        );
      }
      if (spacerStyle === 'flower') {
        return (
          <span 
            key={`spacer-${idx}`} 
            className="text-xs px-0.5 transform scale-90 text-pink-400"
            title="Flower Spacer"
          >
            🌸
          </span>
        );
      }
      if (spacerStyle === 'gold_rondelle') {
        return (
          <div 
            key={`spacer-${idx}`} 
            className="w-2.5 h-6 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 border border-amber-500 shadow-2xs mx-0.5"
            title="Gold Spacer"
          />
        );
      }
      if (spacerStyle === 'pearl') {
        return (
          <div 
            key={`spacer-${idx}`} 
            className="w-3.5 h-3.5 rounded-full bg-radial from-white via-pink-50 to-stone-200 border border-pink-200 shadow-2xs mx-0.5"
            title="Pearl Spacer"
          />
        );
      }
      return <div key={`spacer-${idx}`} className={`w-2.5 h-2.5 rounded-full ${styles.accent} mx-1 opacity-60`} />;
    }

    if (shape === 'round') {
      return (
        <div
          key={`bead-${idx}`}
          onClick={() => audioEngine.playBeadClick()}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${styles.beadBg} ${styles.beadText} ${styles.beadBorder} border-2 flex items-center justify-center font-sans font-bold text-xs sm:text-sm shadow-xs transform transition-all duration-200 hover:scale-115 hover:-translate-y-1 cursor-pointer select-none relative overflow-hidden`}
        >
          {/* Pearl Specular Reflection */}
          <div className="absolute top-1 left-1.5 w-2 h-1 bg-white/90 rounded-full blur-[0.5px]" />
          <span className="relative z-10">{char}</span>
        </div>
      );
    }

    if (shape === 'heart') {
      return (
        <div
          key={`bead-${idx}`}
          onClick={() => audioEngine.playBeadClick()}
          className={`w-7 h-7 sm:w-8 sm:h-8 ${styles.beadBg} ${styles.beadText} ${styles.beadBorder} border-2 rounded-xl rotate-45 flex items-center justify-center font-sans font-bold text-xs sm:text-sm shadow-xs transform transition-all duration-200 hover:scale-115 hover:rotate-12 cursor-pointer select-none relative`}
        >
          <span className="-rotate-45 relative z-10">{char}</span>
        </div>
      );
    }

    if (shape === 'crystal') {
      return (
        <div
          key={`bead-${idx}`}
          onClick={() => audioEngine.playBeadClick()}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-white via-pink-50 to-pink-100 ${styles.beadText} ${styles.beadBorder} border-2 flex items-center justify-center font-sans font-bold text-xs sm:text-sm shadow-xs transform transition-all duration-200 hover:scale-115 hover:rotate-6 cursor-pointer select-none relative ring-1 ring-white/60`}
        >
          <span className="relative z-10">{char}</span>
        </div>
      );
    }

    // Default: Cube
    return (
      <div
        key={`bead-${idx}`}
        onClick={() => audioEngine.playBeadClick()}
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${styles.beadBg} ${styles.beadText} ${styles.beadBorder} border-2 flex items-center justify-center font-sans font-extrabold text-xs sm:text-sm shadow-xs transform transition-all duration-200 hover:scale-115 hover:-translate-y-0.5 cursor-pointer select-none relative`}
      >
        <div className="absolute inset-0 rounded-md border-t border-l border-white/80 pointer-events-none" />
        <span className="relative z-10">{char}</span>
      </div>
    );
  };

  // Add / Save Bracelet
  const handleSaveBracelet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    if (editingId) {
      setBracelets(prev => prev.map(b => {
        if (b.id === editingId) {
          return {
            ...b,
            text: customText.toUpperCase().trim().slice(0, 24),
            colorScheme: selectedScheme,
            beadShape,
            spacerStyle,
            cordStyle,
            leftCharm,
            rightCharm,
            dangleCharm,
            dangleTag: dangleTag.toUpperCase().trim().slice(0, 8),
            charm: dangleCharm,
            charmsList: [leftCharm, dangleCharm, rightCharm].filter(Boolean)
          };
        }
        return b;
      }));
      setEditingId(null);
    } else {
      const newBracelet: FriendshipBraceletItem = {
        id: `bracelet-${Date.now()}`,
        text: customText.toUpperCase().trim().slice(0, 24),
        colorScheme: selectedScheme,
        beadShape,
        spacerStyle,
        cordStyle,
        leftCharm,
        rightCharm,
        dangleCharm,
        dangleTag: dangleTag.toUpperCase().trim().slice(0, 8) || '11 YRS',
        charm: dangleCharm,
        charmsList: [leftCharm, dangleCharm, rightCharm].filter(Boolean)
      };
      setBracelets([newBracelet, ...bracelets]);
    }

    audioEngine.playCharmJingle();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F472B6', '#EC4899', '#FDE047', '#C084FC']
    });
  };

  const handleSelectCharm = (emoji: string) => {
    audioEngine.playBeadClick();
    if (activeCharmTab === 'left') {
      setLeftCharm(emoji);
    } else if (activeCharmTab === 'right') {
      setRightCharm(emoji);
    } else {
      setDangleCharm(emoji);
    }
  };

  const handleRandomize = () => {
    audioEngine.playSparkleChime();
    const randomPhrase = PRESET_PHRASES[Math.floor(Math.random() * PRESET_PHRASES.length)];
    const randomScheme = COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)].id;
    const randomCharms = [...CHARM_OPTIONS].sort(() => 0.5 - Math.random());

    setCustomText(randomPhrase);
    setSelectedScheme(randomScheme);
    setLeftCharm(randomCharms[0].emoji);
    setRightCharm(randomCharms[1].emoji);
    setDangleCharm(randomCharms[2].emoji);
  };

  const handleEdit = (b: FriendshipBraceletItem) => {
    setEditingId(b.id);
    setCustomText(b.text);
    setSelectedScheme(b.colorScheme);
    setBeadShape(b.beadShape || 'cube');
    setSpacerStyle(b.spacerStyle || 'heart');
    setCordStyle(b.cordStyle || 'pink_silk');
    setLeftCharm(b.leftCharm || '🎀');
    setRightCharm(b.rightCharm || '🌸');
    setDangleCharm(b.dangleCharm || b.charm || '💖');
    setDangleTag(b.dangleTag || '11 YRS');
    window.scrollTo({ top: document.getElementById('bracelet-builder')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setBracelets(bracelets.filter(b => b.id !== id));
  };

  const handleCopy = (b: FriendshipBraceletItem) => {
    const charmsStr = `${b.leftCharm || ''} [ ${b.text} ] ${b.rightCharm || ''} • Pendant: ${b.dangleCharm || b.charm} (${b.dangleTag || '11 YRS'})`;
    navigator.clipboard.writeText(`✨ Friendship Bracelet Keepsake: ${charmsStr} • 11 Years of Sisterhood ✨`);
    setCopiedId(b.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Preview Styles for Builder
  const builderStyles = getSchemeStyles(selectedScheme);
  const previewChars = customText.trim() ? customText.toUpperCase().split('') : ['B', 'E', 'S', 'T', 'I', 'E'];

  return (
    <section id="bracelets-section" className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 right-5 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 backdrop-blur-md mb-3 border border-pink-300/80 shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-[#db2777] fill-[#db2777]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-900 font-sans">
              Handcrafted Studio
            </span>
          </div>

          <h2 className="font-script text-5xl sm:text-6xl md:text-7xl text-[#db2777] leading-tight mb-3">
            Friendship Keepsake Bracelets
          </h2>

          <p className="font-editorial italic text-xl sm:text-2xl text-pink-950 mb-3">
            &ldquo;Craft custom bracelets with cute charms, initials, and sweet dedications&rdquo;
          </p>

          <p className="font-sans text-xs sm:text-sm text-pink-900/80 max-w-lg mx-auto">
            Pick your favorite bead shapes, colorful pastel themes, and attach adorable charms—from ribbons and blossoms to dangling heart pendants.
          </p>
        </div>

        {/* BRACELET BUILDER STUDIO */}
        <div id="bracelet-builder" className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200/90 shadow-sm max-w-4xl mx-auto mb-14">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-pink-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#db2777]" />
              <h3 className="font-editorial text-2xl font-bold text-stone-900">
                {editingId ? 'Edit Keepsake Bracelet' : 'Bracelet Design Studio'}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleRandomize}
              className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-800 text-xs font-sans font-semibold border border-pink-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Surprise Charm Mix</span>
            </button>
          </div>

          {/* LIVE BRACELET INTERACTIVE PREVIEW STAGE */}
          <div className="mb-8">
            <div className="text-[11px] font-bold text-pink-900 uppercase tracking-wider mb-2 flex items-center justify-between font-sans">
              <span>Live Bracelet Preview (Click Beads & Charms to Interact)</span>
              <span className="text-pink-600 lowercase font-normal">tap beads for sound ✨</span>
            </div>

            <div className={`relative bg-gradient-to-r ${builderStyles.bg} p-6 sm:p-8 rounded-3xl border-2 ${builderStyles.border} shadow-inner flex flex-col items-center justify-center min-h-[190px] overflow-hidden group`}>
              
              {/* Elastic Cord String Behind Beads */}
              <div className={`absolute top-1/2 left-8 right-8 h-1 ${builderStyles.cordColor} -translate-y-4 rounded-full opacity-80 z-0`} />

              {/* Knot / Clasp Left */}
              <div className="absolute left-6 top-1/2 -translate-y-4 w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-600 shadow-2xs z-10" />
              {/* Knot / Clasp Right */}
              <div className="absolute right-6 top-1/2 -translate-y-4 w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-600 shadow-2xs z-10" />

              {/* Beads String Container */}
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 py-4 max-w-full px-4">
                
                {/* Left Accent Charm */}
                {leftCharm && (
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playCharmJingle();
                      setActiveCharmTab('left');
                    }}
                    className="text-2xl sm:text-3xl p-1 hover:scale-125 transition-transform cursor-pointer relative -translate-y-0.5"
                    title={`Left Charm: ${leftCharm} (Click to change)`}
                  >
                    {leftCharm}
                  </button>
                )}

                {/* Letter Beads & Spacers */}
                {previewChars.map((char, index) => renderBead(char, index, beadShape, builderStyles))}

                {/* Right Accent Charm */}
                {rightCharm && (
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playCharmJingle();
                      setActiveCharmTab('right');
                    }}
                    className="text-2xl sm:text-3xl p-1 hover:scale-125 transition-transform cursor-pointer relative -translate-y-0.5"
                    title={`Right Charm: ${rightCharm} (Click to change)`}
                  >
                    {rightCharm}
                  </button>
                )}
              </div>

              {/* Dangling Pendant / Charm Attachment */}
              {dangleCharm && (
                <div 
                  onClick={() => {
                    audioEngine.playCharmJingle();
                    setActiveCharmTab('dangle');
                  }}
                  className="flex flex-col items-center mt-1 cursor-pointer group/dangle hover:scale-110 transition-transform select-none"
                  title="Dangling Charm Pendant (Click to change)"
                >
                  {/* Jump Ring / Connector */}
                  <div className="w-2.5 h-3.5 border-2 border-amber-400 rounded-full bg-amber-200/40 -mb-1 shadow-2xs" />
                  
                  {/* Hanging Charm Icon */}
                  <div className="text-3xl sm:text-4xl animate-bounce" style={{ animationDuration: '2.5s' }}>
                    {dangleCharm}
                  </div>

                  {/* Engraved Mini Tag */}
                  {dangleTag && (
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider ${builderStyles.tagBg} border shadow-2xs mt-0.5`}>
                      {dangleTag}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* BUILDER CONTROLS FORM */}
          <form onSubmit={handleSaveBracelet} className="space-y-6">
            
            {/* 1. Text / Phrase Input & Quick Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-pink-900 uppercase tracking-wider font-sans">
                  Bracelet Message / Phrase
                </label>
                <span className="text-[11px] text-pink-800 font-sans">
                  {customText.length}/24 characters
                </span>
              </div>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  maxLength={24}
                  placeholder="e.g. BESTIE 11 YRS"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                  className="flex-1 text-sm sm:text-base font-sans font-semibold tracking-widest uppercase px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 bg-white outline-none shadow-2xs"
                  id="bracelet-text-input"
                />

                <button
                  type="submit"
                  disabled={!customText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#db2777] text-white font-sans text-xs font-bold hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  id="save-bracelet-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingId ? 'Update' : 'Add to Collection'}</span>
                </button>
              </div>

              {/* Quick Inspiration Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-pink-800 mr-1 font-sans">Inspirations:</span>
                {PRESET_PHRASES.map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => {
                      audioEngine.playBeadClick();
                      setCustomText(phrase);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-sans transition-colors cursor-pointer border ${
                      customText === phrase
                        ? 'bg-pink-200 text-pink-950 border-pink-300 font-bold'
                        : 'bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100'
                    }`}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. CHARM SELECTOR TRAY */}
            <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-pink-900 uppercase tracking-wider font-sans flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#db2777]" />
                  <span>Select & Attach Charms</span>
                </span>

                {/* Charm Slot Tabs */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-pink-200 text-xs font-sans">
                  <button
                    type="button"
                    onClick={() => setActiveCharmTab('left')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                      activeCharmTab === 'left' ? 'bg-pink-100 text-[#db2777] font-bold' : 'text-stone-600'
                    }`}
                  >
                    Left: {leftCharm || 'None'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCharmTab('dangle')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                      activeCharmTab === 'dangle' ? 'bg-pink-100 text-[#db2777] font-bold' : 'text-stone-600'
                    }`}
                  >
                    Pendant: {dangleCharm || 'None'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCharmTab('right')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                      activeCharmTab === 'right' ? 'bg-pink-100 text-[#db2777] font-bold' : 'text-stone-600'
                    }`}
                  >
                    Right: {rightCharm || 'None'}
                  </button>
                </div>
              </div>

              {/* Charm Grid Picker */}
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 max-h-36 overflow-y-auto p-1">
                {CHARM_OPTIONS.map((charm) => {
                  const isCurrent = 
                    (activeCharmTab === 'left' && leftCharm === charm.emoji) ||
                    (activeCharmTab === 'right' && rightCharm === charm.emoji) ||
                    (activeCharmTab === 'dangle' && dangleCharm === charm.emoji);

                  return (
                    <button
                      key={charm.id}
                      type="button"
                      onClick={() => handleSelectCharm(charm.emoji)}
                      className={`h-11 rounded-xl border text-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isCurrent 
                          ? 'bg-white border-[#db2777] ring-2 ring-pink-300 scale-105 shadow-xs' 
                          : 'bg-white/80 border-pink-200 hover:bg-white hover:scale-105'
                      }`}
                      title={charm.label}
                    >
                      <span>{charm.emoji}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dangling Engraved Tag Customizer */}
              <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-pink-200/80 text-xs font-sans">
                <span className="font-bold text-pink-900">Engraved Mini Tag:</span>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="e.g. 11 YRS"
                  value={dangleTag}
                  onChange={(e) => setDangleTag(e.target.value.toUpperCase())}
                  className="px-3 py-1 text-xs uppercase tracking-wider rounded-lg border border-pink-200 bg-white focus:border-pink-400 outline-none w-28 font-bold text-pink-900"
                />
                <span className="text-[11px] text-pink-700">Dangles directly beneath the pendant</span>
              </div>
            </div>

            {/* 3. Color Theme Selector */}
            <div>
              <span className="text-xs font-bold text-pink-900 uppercase tracking-wider block mb-2 font-sans flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#db2777]" />
                <span>Bead Aesthetic & Palette</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {COLOR_SCHEMES.map((scheme) => (
                  <button
                    key={scheme.id}
                    type="button"
                    onClick={() => {
                      audioEngine.playBeadClick();
                      setSelectedScheme(scheme.id);
                    }}
                    className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                      selectedScheme === scheme.id
                        ? 'border-[#db2777] bg-pink-100 text-[#db2777] ring-2 ring-pink-200 shadow-2xs'
                        : 'border-pink-200 bg-white/70 text-stone-700 hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs font-sans">{scheme.name}</div>
                    <div className="text-[10px] text-stone-500">{scheme.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Advanced Bead Styling Accordion */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="text-xs font-bold text-pink-900 flex items-center gap-1.5 hover:underline cursor-pointer font-sans"
              >
                <Sliders className="w-3.5 h-3.5 text-[#db2777]" />
                <span>{isAdvancedOpen ? 'Hide Bead Shapes & Spacers' : 'Customize Bead Shapes & Spacers'}</span>
              </button>

              {isAdvancedOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 p-4 bg-pink-50/50 rounded-2xl border border-pink-200">
                  {/* Bead Shapes */}
                  <div>
                    <label className="text-[11px] font-bold text-pink-900 uppercase tracking-wider block mb-2 font-sans">
                      Bead Shape
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'cube', name: 'Square Cube', icon: '🔲' },
                        { id: 'round', name: 'Round Pearl', icon: '⚪' },
                        { id: 'heart', name: 'Heart Bead', icon: '💖' },
                        { id: 'crystal', name: 'Faceted Gem', icon: '💎' }
                      ].map(shape => (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => {
                            audioEngine.playBeadClick();
                            setBeadShape(shape.id as BeadShape);
                          }}
                          className={`p-2 rounded-xl text-xs font-sans font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                            beadShape === shape.id 
                              ? 'bg-pink-100 border-[#db2777] text-pink-950 font-bold' 
                              : 'bg-white border-pink-200 text-stone-700 hover:bg-pink-50'
                          }`}
                        >
                          <span>{shape.icon}</span>
                          <span>{shape.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spacers */}
                  <div>
                    <label className="text-[11px] font-bold text-pink-900 uppercase tracking-wider block mb-2 font-sans">
                      Between-Word Spacer
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'heart', name: 'Hearts', icon: '💖' },
                        { id: 'star', name: 'Stars', icon: '⭐' },
                        { id: 'flower', name: 'Blossoms', icon: '🌸' },
                        { id: 'gold_rondelle', name: 'Gold', icon: '✨' },
                        { id: 'pearl', name: 'Pearls', icon: '⚪' },
                        { id: 'none', name: 'Minimal', icon: '—' }
                      ].map(sp => (
                        <button
                          key={sp.id}
                          type="button"
                          onClick={() => {
                            audioEngine.playBeadClick();
                            setSpacerStyle(sp.id as SpacerStyle);
                          }}
                          className={`p-2 rounded-xl text-xs font-sans font-medium border flex items-center gap-1 transition-all cursor-pointer ${
                            spacerStyle === sp.id 
                              ? 'bg-pink-100 border-[#db2777] text-pink-950 font-bold' 
                              : 'bg-white border-pink-200 text-stone-700 hover:bg-pink-50'
                          }`}
                        >
                          <span>{sp.icon}</span>
                          <span className="truncate">{sp.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cancel Edit Button */}
            {editingId && (
              <div className="flex justify-end gap-2 pt-2 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setCustomText('BESTIE 11 YRS');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-pink-50 transition-colors"
                >
                  Cancel Edit
                </button>
              </div>
            )}
          </form>
        </div>

        {/* BRACELETS COLLECTION SHOWCASE */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-editorial text-3xl text-pink-950">
                Saved Keepsake Bracelets
              </h3>
              <p className="text-xs font-sans text-pink-900/70">
                Click any bracelet to inspect in the Keepsake Jewelry Box or copy its charm dedication
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-full text-xs font-sans font-bold bg-pink-100 text-[#db2777] border border-pink-200">
              {bracelets.length} Bracelets Crafted
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bracelets.map((b) => {
              const styles = getSchemeStyles(b.colorScheme);
              const characters = b.text.split('');
              const currentBeadShape = b.beadShape || 'cube';
              const activeDangle = b.dangleCharm || b.charm || '💖';

              return (
                <div
                  key={b.id}
                  className={`bg-gradient-to-r ${styles.bg} p-6 rounded-3xl border-2 ${styles.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
                >
                  {/* Top Header & Tag */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-script text-2xl text-pink-950">
                      {b.text}
                    </span>
                    
                    {b.dangleTag && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase ${styles.tagBg} border shadow-2xs`}>
                        {b.dangleTag}
                      </span>
                    )}
                  </div>

                  {/* Beads & Charms String */}
                  <div 
                    onClick={() => {
                      audioEngine.playCharmJingle();
                      setSelectedGiftBracelet(b);
                    }}
                    className="py-6 flex flex-wrap items-center justify-center gap-1 min-h-[90px] cursor-pointer hover:scale-102 transition-transform"
                    title="Click to view in Jewelry Box"
                  >
                    {/* Left Charm */}
                    {b.leftCharm && (
                      <span className="text-2xl mr-0.5 transform -translate-y-0.5">
                        {b.leftCharm}
                      </span>
                    )}

                    {/* Beads */}
                    {characters.map((char, index) => renderBead(char, index, currentBeadShape, styles))}

                    {/* Right Charm */}
                    {b.rightCharm && (
                      <span className="text-2xl ml-0.5 transform -translate-y-0.5">
                        {b.rightCharm}
                      </span>
                    )}
                  </div>

                  {/* Dangling Pendant */}
                  {activeDangle && (
                    <div className="flex flex-col items-center -mt-2 mb-3">
                      <div className="w-2 h-3 border-2 border-amber-400 rounded-full bg-amber-200/50 -mb-1" />
                      <div className="text-2xl group-hover:animate-bounce">
                        {activeDangle}
                      </div>
                    </div>
                  )}

                  {/* Card Action Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-black/5 text-xs font-sans">
                    <button
                      onClick={() => setSelectedGiftBracelet(b)}
                      className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#db2777] font-semibold flex items-center gap-1.5 shadow-2xs border border-pink-200 cursor-pointer transition-all"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Gift Box</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEdit(b)}
                        className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-stone-600 hover:text-[#db2777] transition-colors"
                        title="Edit Bracelet"
                        aria-label="Edit bracelet"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(b)}
                        className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-stone-600 hover:text-[#db2777] transition-colors"
                        title="Copy text representation"
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
      </div>

      {/* JEWELRY GIFT BOX KEEPSAKE MODAL */}
      {selectedGiftBracelet && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedGiftBracelet(null)}
        >
          <div
            className="bg-[#FFF5F8] rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-pink-200 shadow-2xl relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedGiftBracelet(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close gift box"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f472b6] to-[#db2777] text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                <Gift className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#db2777]">
                11-Year Keepsake Jewelry Box
              </span>
              <h3 className="font-script text-4xl text-[#db2777]">
                {selectedGiftBracelet.text}
              </h3>
            </div>

            {/* Velvet Cushion Display Stage */}
            <div className="bg-gradient-to-b from-[#4A0E2E] to-[#2B081A] p-8 rounded-2xl border-4 border-[#831843] shadow-inner text-center relative overflow-hidden mb-6">
              {/* Velvet Sheen */}
              <div className="absolute inset-0 bg-radial from-pink-500/20 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 py-4">
                {selectedGiftBracelet.leftCharm && (
                  <span className="text-3xl mr-1">{selectedGiftBracelet.leftCharm}</span>
                )}

                {selectedGiftBracelet.text.split('').map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg bg-white text-[#9d174d] border-2 border-pink-300 font-sans font-black text-sm flex items-center justify-center shadow-lg"
                  >
                    {c}
                  </div>
                ))}

                {selectedGiftBracelet.rightCharm && (
                  <span className="text-3xl ml-1">{selectedGiftBracelet.rightCharm}</span>
                )}
              </div>

              {/* Dangle Pendant in Box */}
              {(selectedGiftBracelet.dangleCharm || selectedGiftBracelet.charm) && (
                <div className="relative z-10 flex flex-col items-center mt-1">
                  <div className="w-2.5 h-3.5 border-2 border-amber-300 rounded-full bg-amber-100/40 -mb-1" />
                  <div className="text-3xl">
                    {selectedGiftBracelet.dangleCharm || selectedGiftBracelet.charm}
                  </div>
                  {selectedGiftBracelet.dangleTag && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-950 text-[10px] font-bold uppercase rounded-full shadow-md mt-1">
                      {selectedGiftBracelet.dangleTag}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Dedication Text */}
            <p className="font-editorial italic text-center text-pink-950 text-base mb-6 px-4">
              &ldquo;Handcrafted with 11 years of love, memories, and cherished sisterhood. Always and forever.&rdquo;
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleCopy(selectedGiftBracelet)}
                className="px-5 py-2.5 rounded-xl bg-white border border-pink-300 text-pink-900 hover:bg-pink-50 text-xs font-sans font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                {copiedId === selectedGiftBracelet.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>Copy Keepsake Art</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playSparkleChime();
                  confetti({ particleCount: 70, spread: 70 });
                  setSelectedGiftBracelet(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#db2777] text-white text-xs font-sans font-bold hover:shadow-md transition-all cursor-pointer"
              >
                Cherish Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

