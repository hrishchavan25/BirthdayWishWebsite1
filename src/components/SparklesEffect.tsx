import React, { useEffect, useState } from 'react';

interface AmbientParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export const SparklesEffect: React.FC = () => {
  const [particles, setParticles] = useState<AmbientParticle[]>([]);

  useEffect(() => {
    // Generate minimal, elegant ambient light specks (soft round micro-dust)
    const count = 18;
    const initialParticles: AmbientParticle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2, // 2px to 5px subtle dots
      opacity: Math.random() * 0.35 + 0.15,
      duration: Math.random() * 8 + 7,
      delay: Math.random() * 5
    }));

    setParticles(initialParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Luxury Ambient Atmospheric Light Halos in Soft Baby Pink */}
      <div className="absolute -top-32 -left-32 w-[38rem] h-[38rem] bg-pink-300/30 rounded-full blur-[140px]" />
      <div className="absolute top-1/4 -right-32 w-[40rem] h-[40rem] bg-rose-200/35 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[15%] w-[42rem] h-[42rem] bg-pink-200/30 rounded-full blur-[160px]" />
      <div className="absolute top-[55%] -left-20 w-[32rem] h-[32rem] bg-pink-100/40 rounded-full blur-[130px]" />
      <div className="absolute bottom-1/3 right-[20%] w-[30rem] h-[30rem] bg-fuchsia-100/25 rounded-full blur-[140px]" />

      {/* Ultra-Subtle Minimalist Ambient Baby Pink Light Specks */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-tr from-pink-400 via-rose-300 to-pink-200 animate-float transition-opacity duration-1000 pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: '0 0 12px rgba(244, 114, 182, 0.6)'
          }}
        />
      ))}
    </div>
  );
};
