'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

// ─────────────────────────────────────────────
// SOUND WAVE BARS UI
// ─────────────────────────────────────────────
function SoundWave({ isPlaying }: { isPlaying: boolean }) {
  const bars = [0.5, 0.9, 0.6, 1, 0.45, 0.8, 0.55, 0.95, 0.4, 0.7];
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true" style={{ height: 18 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 2.5,
            height: `${h * 100}%`,
            borderRadius: 2,
            background: 'linear-gradient(to top, #D4AF37, #F1D9A0)',
            transformOrigin: 'center',
            animationName: isPlaying ? 'sound-wave' : 'none',
            animationDuration: `${0.55 + i * 0.06}s`,
            animationDelay: `${i * 0.055}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
            transform: isPlaying ? undefined : 'scaleY(0.3)',
            transition: 'transform 0.4s',
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// MUSIC PLAYER COMPONENT
// Uses bollywood.mp3 with looping support
// ─────────────────────────────────────────────
export default function MusicPlayer({
  triggerPlay,
  autoPlay,
}: {
  triggerPlay?: boolean;
  autoPlay?: boolean;
}) {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);

  // Create audio element once on mount
  useEffect(() => {
    const audio = new Audio('/audio/bollywood.mp3');
    audio.loop = true;       // loop infinitely
    audio.volume = 0.75;
    audio.preload = 'auto';

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => {
      // Shouldn't fire since loop=true, but just in case
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Auto-play when card opens (after spike/transition)
  useEffect(() => {
    if (!autoPlay || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const timer = setTimeout(() => {
      audioRef.current?.play().catch(() => {
        // Autoplay blocked — user can manually tap the button
      });
    }, 600); // slight delay so confetti lands first

    return () => clearTimeout(timer);
  }, [autoPlay]);

  // Toggle play / pause
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 right-5 z-50"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.5, duration: 0.5, type: 'spring', stiffness: 120 }}
    >
      <motion.button
        id="music-player-btn"
        onClick={toggle}
        className="flex items-center justify-center rounded-full"
        style={{
          width: 46,
          height: 46,
          background: 'rgba(26, 8, 16, 0.85)',
          backdropFilter: 'blur(20px)',
          border: `1.5px solid ${isPlaying ? 'rgba(212,175,55,0.65)' : 'rgba(212,175,55,0.3)'}`,
          boxShadow: isPlaying
            ? '0 0 18px rgba(212,175,55,0.35), 0 2px 12px rgba(0,0,0,0.5)'
            : '0 2px 12px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.4s, border-color 0.4s',
        }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isPlaying ? t('pause_music') : t('play_music')}
        aria-pressed={isPlaying}
      >
        {isPlaying ? (
          <SoundWave isPlaying={isPlaying} />
        ) : (
          // Music note icon when paused
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(241,217,160,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </motion.button>
    </motion.div>
  );
}
