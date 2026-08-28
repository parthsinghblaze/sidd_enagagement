'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

// Animated sound wave bars
function SoundWave({ isPlaying }: { isPlaying: boolean }) {
  const bars = [1, 0.5, 0.8, 0.4, 0.9, 0.6, 1, 0.45];
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true" style={{ height: 18 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: `${h * 100}%`,
            borderRadius: 2,
            background: 'linear-gradient(to top, #D4AF37, #F1D9A0)',
            transformOrigin: 'center',
            animationName: isPlaying ? 'sound-wave' : 'none',
            animationDuration: `${0.6 + i * 0.07}s`,
            animationDelay: `${i * 0.06}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
            transform: isPlaying ? undefined : 'scaleY(0.35)',
            transition: 'transform 0.3s',
          }}
        />
      ))}
    </div>
  );
}

export default function MusicPlayer({ triggerPlay }: { triggerPlay?: boolean }) {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasAudioFile, setHasAudioFile] = useState(true);
  const howlRef = useRef<any>(null);
  const initializedRef = useRef(false);

  const initHowl = useCallback(async () => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const { Howl } = await import('howler');
      const howl = new Howl({
        src: ['/audio/background.mp3'],
        loop: true,
        volume: 0.45,
        html5: true,
        onload: () => setIsLoaded(true),
        onloaderror: () => {
          setHasAudioFile(false);
          setIsLoaded(false);
        },
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
      });
      howlRef.current = howl;
    } catch {
      setHasAudioFile(false);
    }
  }, []);

  // When cover is tapped (triggerPlay), initialize Howl (satisfies autoplay policy)
  useEffect(() => {
    if (triggerPlay && !initializedRef.current) {
      initHowl();
    }
  }, [triggerPlay, initHowl]);

  const toggle = async () => {
    if (!howlRef.current) {
      await initHowl();
      // Small delay to let Howl initialize
      setTimeout(() => {
        howlRef.current?.play();
      }, 200);
      return;
    }
    if (isPlaying) {
      howlRef.current.pause();
    } else {
      howlRef.current.play();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      howlRef.current?.unload();
    };
  }, []);

  if (!hasAudioFile) return null;

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.7, type: 'spring' }}
    >
      <motion.button
        id="music-player-btn"
        onClick={toggle}
        className="flex items-center gap-3 px-5 py-3 rounded-full"
        style={{
          background: 'rgba(26, 8, 16, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212,175,55,0.35)',
          boxShadow: isPlaying
            ? '0 0 20px rgba(212,175,55,0.25), 0 4px 20px rgba(0,0,0,0.5)'
            : '0 4px 20px rgba(0,0,0,0.5)',
          transition: 'box-shadow 0.4s',
          minHeight: 48,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? t('pause_music') : t('play_music')}
        aria-pressed={isPlaying}
      >
        <SoundWave isPlaying={isPlaying} />
        <span
          className="font-body text-xs tracking-widest uppercase"
          style={{
            color: isPlaying ? 'var(--color-gold-light)' : 'rgba(241,217,160,0.55)',
            letterSpacing: '0.12em',
            fontSize: '0.65rem',
            transition: 'color 0.3s',
          }}
        >
          {isPlaying ? t('pause_music') : t('play_music')}
        </span>
      </motion.button>
    </motion.div>
  );
}
