'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

// ─────────────────────────────────────────────
// SYNTHESIZED INDIAN AMBIENT MUSIC ENGINE
// Raga Yaman — the classical romantic raga
// Drone (tanpura) + melodic phrases + reverb
// ─────────────────────────────────────────────
function createIndianSynth() {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioCtx() as AudioContext;

  // Master output with soft gain
  const master = ctx.createGain();
  master.gain.value = 0.55;
  master.connect(ctx.destination);

  // Pseudo-reverb via feedback delay
  const delay = ctx.createDelay(2.5);
  delay.delayTime.value = 0.38;
  const delayFeed = ctx.createGain();
  delayFeed.gain.value = 0.28;
  const delayOut = ctx.createGain();
  delayOut.gain.value = 0.22;
  delay.connect(delayFeed);
  delayFeed.connect(delay);
  delay.connect(delayOut);
  delayOut.connect(master);

  // High-pass to keep reverb tail clean
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 80;
  delayOut.connect(hp);
  hp.connect(master);

  // ── Tanpura drone (Sa + Pa) ──
  const droneNodes: AudioNode[] = [];
  const droneData: [number, number, OscillatorType][] = [
    [130.81, 0.055, 'sawtooth'],   // C3 (low Sa)
    [196.00, 0.048, 'sawtooth'],   // G3 (Pa)
    [261.63, 0.042, 'sawtooth'],   // C4 (mid Sa)
    [392.00, 0.028, 'sawtooth'],   // G4 (high Pa)
  ];

  droneData.forEach(([freq, vol, type]) => {
    // Slightly detune two oscillators for richness
    [-2, 0, 2].forEach((cent) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq * Math.pow(2, cent / 1200);
      g.gain.value = vol / 3;
      osc.connect(g);
      g.connect(master);
      g.connect(delay);
      osc.start();
      droneNodes.push(osc, g);
    });
  });

  // ── Raga Yaman scale (Lydian ≈ romantic, uplifting) ──
  // C  D  E  F#  G  A  B  C5
  const scale = [261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 523.25];

  // Melodic phrases — index into scale[]
  const phrases = [
    [0, 2, 4, 6, 7, 6, 4, 2],       // ascending phrase (Aaroh)
    [7, 5, 4, 2, 1, 0, 2, 4],       // descending phrase (Avaroh)
    [4, 6, 7, 6, 4, 5, 4, 2],       // Gandhar-Nishad flourish
    [2, 4, 6, 7, 6, 4, 2, 0],       // Rishabh phrase
    [0, 2, 4, 6, 7, 4, 2, 4, 6, 7], // longer pakad
    [7, 6, 4, 6, 7, 5, 4, 2, 0],    // calm descent
  ];

  let phraseIdx = 0;
  let noteIdx = 0;
  let nextNoteTime = 0;
  const NOTE_GAP = 0.78; // seconds between notes
  let schedulerTimer: ReturnType<typeof setTimeout> | null = null;
  let running = false;

  function scheduleNotes() {
    const LOOKAHEAD = 0.25; // schedule 250ms ahead
    while (nextNoteTime < ctx.currentTime + LOOKAHEAD) {
      const phrase = phrases[phraseIdx % phrases.length];
      const scaleIdx = phrase[noteIdx % phrase.length];
      const baseFreq = scale[scaleIdx];

      // Occasional octave variation for texture
      const octave = noteIdx % 11 === 0 ? 0.5 : noteIdx % 7 === 0 ? 2 : 1;
      const freq = baseFreq * octave;

      // Sitar-like timbre: triangle + sawtooth blend
      ['triangle' as OscillatorType, 'sawtooth' as OscillatorType].forEach((type, ti) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        const vol = type === 'triangle' ? 0.09 : 0.025;
        g.gain.setValueAtTime(0, nextNoteTime);
        g.gain.linearRampToValueAtTime(vol, nextNoteTime + 0.06);
        g.gain.setValueAtTime(vol * 0.75, nextNoteTime + 0.22);
        g.gain.exponentialRampToValueAtTime(0.0001, nextNoteTime + NOTE_GAP * 0.88);
        osc.connect(g);
        g.connect(master);
        if (ti === 0) g.connect(delay); // only send main osc to reverb
        osc.start(nextNoteTime);
        osc.stop(nextNoteTime + NOTE_GAP);
      });

      noteIdx++;
      if (noteIdx > 0 && noteIdx % phrase.length === 0) {
        phraseIdx++;
        noteIdx = 0;
        nextNoteTime += NOTE_GAP * 0.6; // breath/pause between phrases
      }
      nextNoteTime += NOTE_GAP;
    }

    schedulerTimer = setTimeout(scheduleNotes, 120);
  }

  return {
    play() {
      if (!running) {
        if (ctx.state === 'suspended') ctx.resume();
        running = true;
        nextNoteTime = ctx.currentTime + 0.4;
        scheduleNotes();
      }
    },
    pause() {
      running = false;
      if (schedulerTimer) clearTimeout(schedulerTimer);
      ctx.suspend();
    },
    resume() {
      if (!running) {
        ctx.resume();
        running = true;
        nextNoteTime = ctx.currentTime + 0.2;
        scheduleNotes();
      }
    },
    get isRunning() {
      return running;
    },
    destroy() {
      running = false;
      if (schedulerTimer) clearTimeout(schedulerTimer);
      droneNodes.forEach((n) => {
        try { (n as OscillatorNode).stop?.(); } catch { /* noop */ }
      });
      ctx.close();
    },
  };
}

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
  const synthRef = useRef<ReturnType<typeof createIndianSynth> | null>(null);
  const initializedRef = useRef(false);

  // Initialize synth after first user interaction
  const initSynth = useCallback(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    try {
      synthRef.current = createIndianSynth();
    } catch {
      // Web Audio not available
    }
  }, []);

  // Initialize on cover tap
  useEffect(() => {
    if (triggerPlay && !initializedRef.current) {
      initSynth();
    }
  }, [triggerPlay, initSynth]);

  // Auto-play when card opens
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(() => {
      if (!synthRef.current) initSynth();
      setTimeout(() => {
        synthRef.current?.play();
        setIsPlaying(true);
      }, 200);
    }, 600); // slight delay so confetti lands first
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  // Cleanup
  useEffect(() => {
    return () => {
      synthRef.current?.destroy();
    };
  }, []);

  const toggle = () => {
    if (!synthRef.current) {
      initSynth();
      setTimeout(() => {
        synthRef.current?.play();
        setIsPlaying(true);
      }, 100);
      return;
    }
    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
    } else {
      synthRef.current.resume();
      setIsPlaying(true);
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
