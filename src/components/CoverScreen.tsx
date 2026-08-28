'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

// Gold wax seal SVG
function GoldSeal() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#7A1F2B" stroke="#D4AF37" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="30" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3 2" />
      {/* Star points */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
        const x1 = 40 + 38 * Math.cos(angle);
        const y1 = 40 + 38 * Math.sin(angle);
        const x2 = 40 + 30 * Math.cos(angle + Math.PI / 8);
        const y2 = 40 + 30 * Math.sin(angle + Math.PI / 8);
        return <line key={i} x1={40} y1={40} x2={x1} y2={y1} stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />;
      })}
      {/* S&K monogram */}
      <text x="40" y="37" textAnchor="middle" fontSize="11" fill="#D4AF37" fontFamily="Georgia, serif" fontStyle="italic">S & K</text>
      <text x="40" y="51" textAnchor="middle" fontSize="6" fill="#D4AF37" fontFamily="Georgia, serif" letterSpacing="2">ENGAGEMENT</text>
    </svg>
  );
}

// Mandala corner motif
function MandalaCorner({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="100" height="100"
      viewBox="0 0 100 100"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, opacity: 0.6 }}
    >
      <g stroke="#D4AF37" fill="none" strokeWidth="0.8">
        <path d="M5,5 Q50,5 95,5 Q95,50 95,95" strokeWidth="0.4" opacity="0.4" />
        <path d="M5,5 C5,5 30,10 45,35 C60,60 65,85 95,95" strokeWidth="0.6" opacity="0.5" />
        <circle cx="5" cy="5" r="3" fill="#D4AF37" opacity="0.7" />
        {/* Petal motifs */}
        {[15, 25, 35, 45, 55].map((pos, i) => (
          <ellipse key={i} cx={pos * 0.7} cy={pos * 0.7} rx="4" ry="6"
            transform={`rotate(${45 + i * 5} ${pos * 0.7} ${pos * 0.7})`}
            fill="#D4AF37" opacity={0.2 + i * 0.05} />
        ))}
        <path d="M5,50 Q30,30 50,5" strokeWidth="0.4" strokeDasharray="2 2" opacity="0.4" />
        <path d="M50,5 Q55,30 80,35 Q85,55 95,50" strokeWidth="0.4" strokeDasharray="2 2" opacity="0.3" />
      </g>
    </svg>
  );
}

interface CoverScreenProps {
  onOpen: () => void;
  guestName?: string;
  onChime?: () => void;
}

// Web Audio chime — plays a pleasant sparkle arpeggio on tap
function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5 E5 G5 C6 E6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.22, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.9);
      osc.start(t0);
      osc.stop(t0 + 0.9);
    });
    // Closing bell chord
    [523.25, 659.25, 783.99].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + notes.length * 0.1 + 0.05;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.15, t0 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.4);
      osc.start(t0);
      osc.stop(t0 + 1.4);
    });
  } catch { /* ignore if Web Audio not available */ }
}

export default function CoverScreen({ onOpen, guestName }: CoverScreenProps) {
  const { t, lang } = useLanguage();

  const fontClass =
    lang === 'hi' ? 'font-devanagari' :
    lang === 'gu' ? 'font-gujarati' : 'font-body';

  const handleTap = () => {
    playChime();
    onOpen();
  };

  return (
    <motion.div
      id="cover-screen"
      className="full-screen relative flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a0810 0%, #3d0f1c 50%, #1a0810 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background illustration */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/illustrations/cover.png"
          alt="Engagement invitation cover illustration"
          fill
          priority
          className="object-cover"
          style={{ opacity: 0.55 }}
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(26,8,16,0.45) 0%, rgba(26,8,16,0.2) 40%, rgba(26,8,16,0.7) 100%)',
          }}
        />
      </div>

      {/* Corner ornaments */}
      <div className="absolute top-0 left-0 z-10 pointer-events-none">
        <MandalaCorner />
      </div>
      <div className="absolute top-0 right-0 z-10 pointer-events-none">
        <MandalaCorner flip />
      </div>
      <div className="absolute bottom-0 left-0 z-10 pointer-events-none" style={{ transform: 'rotate(90deg) scaleX(-1)' }}>
        <MandalaCorner />
      </div>
      <div className="absolute bottom-0 right-0 z-10 pointer-events-none" style={{ transform: 'rotate(90deg)' }}>
        <MandalaCorner flip />
      </div>

      {/* Twinkling stars */}
      <TwinklingStars />

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center px-6 text-center gap-6">
        {/* Script top text */}
        <motion.p
          className="font-script text-gold-shimmer"
          style={{ fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', lineHeight: 1.2 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {t('you_are_invited')}
        </motion.p>

        {/* Guest name if provided */}
        {guestName && (
          <motion.p
            className={`${fontClass} text-lg`}
            style={{ color: 'var(--color-gold-light)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {t('dear_guest', { name: guestName })}
          </motion.p>
        )}

        {/* Gold seal + names */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.9, type: 'spring', stiffness: 100 }}
        >
          <div className="animate-pulse-glow rounded-full">
            <GoldSeal />
          </div>
          <div className="text-center">
            <h1
              className="font-serif text-gold-shimmer"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', fontWeight: 600, lineHeight: 1.1 }}
            >
              {t('groom_name')}
            </h1>
            <p className="font-script" style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', color: 'var(--color-gold-light)', margin: '4px 0' }}>
              &amp;
            </p>
            <h1
              className="font-serif text-gold-shimmer"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', fontWeight: 600, lineHeight: 1.1 }}
            >
              {t('bride_name')}
            </h1>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="ornamental-divider w-48 mx-auto" />

        {/* Tap to open CTA — clean gold pill button */}
        <motion.button
          id="tap-to-open-btn"
          onClick={handleTap}
          className={`${fontClass} relative`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Open the invitation"
          style={{ minHeight: 52, minWidth: 200 }}
        >
          {/* Outer pulse ring */}
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(212,175,55,0.55)' }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Button surface */}
          <span
            className="flex items-center justify-center gap-2 rounded-full animate-text-glow"
            style={{
              padding: '14px 40px',
              background: 'rgba(26,8,16,0.55)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(212,175,55,0.5)',
              boxShadow: '0 0 24px rgba(212,175,55,0.12), inset 0 0 12px rgba(212,175,55,0.05)',
              color: 'var(--color-gold-light)',
              letterSpacing: '0.18em',
              fontSize: 'clamp(0.7rem, 2.8vw, 0.82rem)',
              textTransform: 'uppercase',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '0.9em', opacity: 0.8 }}>✦</span>
            {t('tap_to_open')}
            <span style={{ fontSize: '0.9em', opacity: 0.8 }}>✦</span>
          </span>
        </motion.button>
      </div>

      {/* Bottom ribbon */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 flex justify-center z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <div className="ornamental-divider w-48" />
      </motion.div>
    </motion.div>
  );
}

function TwinklingStars() {
  const stars = Array.from({ length: 42 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 85,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 2.5 + 1.2,
    shape: i % 5 === 0 ? 'star' : 'dot',
  }));

  return (
    <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            borderRadius: star.shape === 'star' ? '2px' : '50%',
            background: star.shape === 'star'
              ? 'linear-gradient(45deg, #D4AF37, #F1D9A0)'
              : '#F1D9A0',
            transform: star.shape === 'star' ? 'rotate(45deg)' : undefined,
            animationName: 'twinkling',
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </div>
  );
}
