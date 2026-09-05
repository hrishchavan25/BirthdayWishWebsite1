import React, { useState, useEffect, useRef } from 'react';
import { PolaroidPhoto } from '../types';
import { PHOTO_ASSET_BY_FILENAME, POLAROID_PHOTOS } from '../data/memories';
import { ChevronLeft, ChevronRight, Upload, Plus, Trash2, Edit2, Maximize2, Camera, Check, X, Heart, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioSynth';
import { useSharedStorage } from '../utils/sharedStorage';

const STORAGE_KEY = 'ts_birthday_polaroids_v1';

export const PhotoCarousel: React.FC = () => {
  const [photos, setPhotos] = useSharedStorage(STORAGE_KEY, POLAROID_PHOTOS);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [selectedPhotoForModal, setSelectedPhotoForModal] = useState<PolaroidPhoto | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PolaroidPhoto | null>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  // Form states
  const [formUrl, setFormUrl] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formYear, setFormYear] = useState('Year 11');
  const [formLocation, setFormLocation] = useState('Our Special Memory');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(currentPhotos => currentPhotos.map(photo => ({
      ...photo,
      url: PHOTO_ASSET_BY_FILENAME[photo.url] ?? photo.url
    })));
  }, [setPhotos]);
  useEffect(() => {
    if (!isAutoPlay || photos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % photos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay, photos.length]);

  const handleNext = () => {
    if (photos.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    if (photos.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (!formUrl) return;

    if (editingPhoto) {
      setPhotos(photos.map(p => p.id === editingPhoto.id ? {
        ...p,
        url: formUrl,
        caption: formCaption || 'Forever Best Friends',
        year: formYear,
        location: formLocation
      } : p));
      setEditingPhoto(null);
    } else {
      const newPhoto: PolaroidPhoto = {
        id: `photo-${Date.now()}`,
        url: formUrl,
        caption: formCaption || 'Forever Best Friends',
        year: formYear,
        location: formLocation,
        rotationDeg: (Math.random() * 4) - 2,
        tag: 'Photo Memory',
        heartColor: '#BE123C'
      };
      setPhotos([...photos, newPhoto]);
      setCurrentIndex(photos.length);

      audioEngine.playSparkleChime();
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#BE123C', '#FDA4AF', '#FDE047']
      });
    }

    // Reset form
    setFormUrl('');
    setFormCaption('');
    setIsAddModalOpen(false);
  };

  const openEdit = (photo: PolaroidPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPhoto(photo);
    setFormUrl(photo.url);
    setFormCaption(photo.caption);
    setFormYear(photo.year);
    setFormLocation(photo.location || '');
    setIsAddModalOpen(true);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos(photos.filter(p => p.id !== id));
    if (currentIndex >= photos.length - 1) {
      setCurrentIndex(Math.max(0, photos.length - 2));
    }
  };

  return (
    <section id="polaroids-section" className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 backdrop-blur-md mb-3 border border-pink-300/80 shadow-2xs">
            <Camera className="w-3.5 h-3.5 text-[#db2777]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-900 font-sans">
              Cherished Snapshots
            </span>
          </div>

          <h2 className="font-script text-5xl sm:text-6xl md:text-7xl text-[#db2777] leading-tight mb-3">
            Our Polaroid Memories
          </h2>

          <p className="font-editorial italic text-xl sm:text-2xl text-pink-950 mb-3">
            &ldquo;Every picture tells the story of 11 years we will never forget&rdquo;
          </p>

          <p className="font-sans text-xs sm:text-sm text-pink-900/80 max-w-lg mx-auto">
            Browse through our timeless photo scrapbook. You can upload custom pictures of her, add heartfelt captions, and preserve your special moments.
          </p>
        </div>

        {/* Action Bar (Upload Photo + View Switcher) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-pink-200/80 shadow-2xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingPhoto(null);
                setFormUrl('');
                setFormCaption('');
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#db2777] text-white font-sans text-xs font-semibold hover:shadow-md transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              id="upload-polaroid-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your Photo of Her</span>
            </button>

            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-3 py-2 rounded-xl text-xs font-sans font-medium border transition-colors cursor-pointer ${
                isAutoPlay
                  ? 'bg-pink-100 text-[#db2777] border-pink-300'
                  : 'bg-white text-stone-600 border-pink-200 hover:bg-pink-50'
              }`}
            >
              {isAutoPlay ? 'Pause Slideshow' : 'Autoplay Slideshow'}
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-pink-100/70 p-1 rounded-xl border border-pink-200/60">
            <button
              onClick={() => setViewMode('carousel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
                viewMode === 'carousel'
                  ? 'bg-white text-[#db2777] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Carousel Mode
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#db2777] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Scrapbook Grid
            </button>
          </div>
        </div>

        {/* CAROUSEL VIEW */}
        {viewMode === 'carousel' && photos.length > 0 && (
          <div className="relative flex flex-col items-center">
            <div className="relative w-full max-w-md mx-auto aspect-[3/4] flex items-center justify-center py-4">
              {photos.map((photo, index) => {
                const offset = index - currentIndex;
                const isCurrent = offset === 0;
                const isPrev = offset === -1 || (currentIndex === 0 && index === photos.length - 1);
                const isNext = offset === 1 || (currentIndex === photos.length - 1 && index === 0);

                if (!isCurrent && !isPrev && !isNext) return null;

                return (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhotoForModal(photo)}
                    style={{
                      transform: isCurrent
                        ? `rotate(${photo.rotationDeg || 0}deg) scale(1)`
                        : isPrev
                        ? 'translateX(-65%) scale(0.85) rotate(-6deg)'
                        : 'translateX(65%) scale(0.85) rotate(6deg)',
                      zIndex: isCurrent ? 20 : 10,
                      opacity: isCurrent ? 1 : 0.4
                    }}
                    className="absolute w-72 sm:w-80 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-pink-200 transition-all duration-500 cursor-pointer group hover:shadow-2xl"
                  >
                    {/* Polaroid Image Area */}
                    <div className="aspect-square w-full rounded-lg overflow-hidden bg-pink-50 relative mb-4 border border-pink-100">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs p-1.5 rounded-full text-white">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Polaroid Caption Area */}
                    <div className="text-center font-sans space-y-1">
                      <p className="font-script text-2xl sm:text-3xl text-[#9d174d] leading-tight">
                        {photo.caption}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-pink-100">
                        <span className="font-semibold text-pink-700">{photo.year}</span>
                        <span>{photo.location}</span>
                      </div>
                    </div>

                    {/* Quick Edit/Delete on Current Card */}
                    {isCurrent && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-xs p-1 rounded-xl shadow-xs border border-pink-200">
                        <button
                          onClick={(e) => openEdit(photo, e)}
                          className="p-1 text-stone-600 hover:text-[#db2777] rounded"
                          title="Edit Caption"
                          aria-label="Edit caption"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeletePhoto(photo.id, e)}
                          className="p-1 text-stone-400 hover:text-pink-700 rounded"
                          title="Remove Photo"
                          aria-label="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-white text-stone-800 border border-pink-200 hover:bg-pink-50 hover:text-[#db2777] shadow-xs transition-all cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-sans text-xs font-semibold text-pink-900">
                {currentIndex + 1} / {photos.length}
              </span>

              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white text-stone-800 border border-pink-200 hover:bg-pink-50 hover:text-[#db2777] shadow-xs transition-all cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* SCRAPBOOK GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhotoForModal(photo)}
                className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-pink-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-pink-50 relative mb-4 border border-pink-100">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs p-1.5 rounded-full text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="text-center font-sans space-y-1">
                  <p className="font-script text-2xl text-[#9d174d] leading-tight">
                    {photo.caption}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-pink-100">
                    <span className="font-semibold text-pink-700">{photo.year}</span>
                    <span>{photo.location}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 mt-3 pt-2 border-t border-pink-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => openEdit(photo, e)}
                    className="p-1 text-stone-500 hover:text-[#db2777] text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={(e) => handleDeletePhoto(photo.id, e)}
                    className="p-1 text-stone-400 hover:text-pink-700 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL: PHOTO LIGHTBOX */}
        {selectedPhotoForModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedPhotoForModal(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-pink-200 relative animate-scale-up text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhotoForModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-100 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-pink-50 mb-5 border border-pink-100">
                <img
                  src={selectedPhotoForModal.url}
                  alt={selectedPhotoForModal.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-script text-3xl sm:text-4xl text-[#db2777] mb-1">
                {selectedPhotoForModal.caption}
              </h3>
              <p className="text-xs font-sans font-semibold text-pink-800 uppercase tracking-widest">
                {selectedPhotoForModal.year} • {selectedPhotoForModal.location}
              </p>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT PHOTO */}
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsAddModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-pink-200 animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-editorial text-2xl font-bold text-stone-900">
                  {editingPhoto ? 'Edit Photo Memory' : 'Add Photo of Her'}
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 font-sans text-xs">
                {/* File Upload / URL */}
                <div>
                  <label className="font-bold text-stone-600 uppercase tracking-wider block mb-1.5">
                    Upload Photo or Paste Image URL
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-pink-200 hover:border-pink-400 rounded-2xl p-4 text-center cursor-pointer bg-pink-50/70 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-[#db2777] mx-auto mb-1.5" />
                    <p className="font-semibold text-stone-700">Click to upload from device</p>
                    <p className="text-[11px] text-stone-500">Supports JPG, PNG, WebP</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-stone-400">or</span>
                    <input
                      type="url"
                      placeholder="Paste Image URL..."
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 rounded-xl border border-pink-200 focus:border-pink-400 outline-none"
                    />
                  </div>
                </div>

                {/* Preview if URL exists */}
                {formUrl && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-pink-50 relative border border-pink-100">
                    <img
                      src={formUrl}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Caption */}
                <div>
                  <label className="font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    Handwritten Caption
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 11 Years of Laughs"
                    value={formCaption}
                    onChange={(e) => setFormCaption(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-pink-200 focus:border-pink-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-600 uppercase tracking-wider block mb-1">
                      Friendship Year
                    </label>
                    <input
                      type="text"
                      placeholder="Year 11"
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-pink-200 focus:border-pink-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-600 uppercase tracking-wider block mb-1">
                      Location / Memory
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Birthday Celebration"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-pink-200 focus:border-pink-400 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-pink-100">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-pink-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePhoto}
                  disabled={!formUrl}
                  className="px-5 py-2 rounded-xl bg-[#db2777] text-white text-xs font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Check className="w-4 h-4" />
                  Save Photo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
