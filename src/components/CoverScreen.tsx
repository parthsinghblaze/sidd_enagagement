'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';



// Pre-compute sunburst ray coordinates ONCE at module load so SSR and client
// produce identical values — prevents React hydration mismatch from
// floating-point differences between Node.js and V8 in the browser.
const SUNBURST_RAYS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * Math.PI * 2) / 12;
  return {
    x1: parseFloat((40 + 36 * Math.cos(angle)).toFixed(4)),
    y1: parseFloat((40 + 36 * Math.sin(angle)).toFixed(4)),
    x2: parseFloat((40 + 32 * Math.cos(angle)).toFixed(4)),
    y2: parseFloat((40 + 32 * Math.sin(angle)).toFixed(4)),
  };
});

// Traditional Auspicious Gold Ganesha Motif
function GoldGaneshaMotif() {
  return (
    <svg width="68" height="68" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Auspicious Lord Ganesha Motif">
      <defs>
        <linearGradient id="ganeshaGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#997008" />
          <stop offset="30%" stopColor="#D4AF37" />
          <stop offset="60%" stopColor="#FFF2B2" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <filter id="ganeshaGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Sunburst rays — use pre-computed static coords to avoid SSR/client mismatch */}
      {SUNBURST_RAYS.map((ray, i) => (
        <line key={i} x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2} stroke="url(#ganeshaGold)" strokeWidth="0.8" opacity="0.5" />
      ))}

      {/* Outer halo circle */}
      <circle cx="40" cy="40" r="32" fill="none" stroke="url(#ganeshaGold)" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />

      {/* Lord Ganesha Minimal Line Art */}
      <g stroke="url(#ganeshaGold)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#ganeshaGlow)">
        {/* Crown Mukut */}
        <path d="M35,18 L40,12 L45,18 Z" fill="url(#ganeshaGold)" stroke="none" />
        <line x1="33" y1="20" x2="47" y2="20" strokeWidth="1.2" />

        {/* Head & Large Ears */}
        <path d="M26,24 C32,21 48,21 54,24 C57,28 54,34 49,34 C44,34 44,28 40,28 C36,28 36,34 31,34 C26,34 23,28 26,24 Z" />

        {/* Trunk (Trunk turning right/left gracefully) */}
        <path d="M40,28 C40,40 47,44 45,49 C43,53 37,51 36,47" strokeWidth="1.8" />

        {/* Red/Gold Tilak on forehead */}
        <path d="M38,22 Q40,19 42,22" stroke="#E11D48" strokeWidth="1.5" />
        <circle cx="40" cy="24" r="1" fill="#FFF2B2" stroke="none" />

        {/* Modak in trunk curve */}
        <circle cx="34" cy="46" r="1.5" fill="url(#ganeshaGold)" stroke="none" />
      </g>
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

  const isIndic   = lang === 'hi' || lang === 'gu';
  const nameClass = isIndic ? fontClass : 'font-serif text-gold-shimmer tracking-tight';
  const nameLineH = isIndic ? 1.5 : 1.05;
  const nameFontW = isIndic ? 500 : 600;

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

        {/* Auspicious Lord Ganesha Gold Motif */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
          className="my-1 flex justify-center"
        >
          <GoldGaneshaMotif />
        </motion.div>

        {/* Couple names — luxury typography */}
        <motion.div
          className="flex flex-col items-center gap-3 my-2"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.9, type: 'spring', stiffness: 90 }}
        >
          <div className="text-center flex flex-col items-center">
            <h1
              className={nameClass}
              style={{ fontSize: 'clamp(2.8rem, 11vw, 5.2rem)', fontWeight: nameFontW, lineHeight: nameLineH }}
            >
              {t('groom_name')}
            </h1>
            <p
              className="font-script my-1"
              style={{ fontSize: 'clamp(1.8rem, 7vw, 2.8rem)', color: 'var(--color-gold-light)', lineHeight: 1 }}
            >
              &amp;
            </p>
            <h1
              className={nameClass}
              style={{ fontSize: 'clamp(2.8rem, 11vw, 5.2rem)', fontWeight: nameFontW, lineHeight: nameLineH }}
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

// Generated once at module load — stable across SSR/client
const STARS = Array.from({ length: 42 }, (_, i) => ({
  id: i,
  x: (i * 7.3 + 13) % 100,                      // deterministic spread
  y: (i * 11.7 + 5) % 85,
  size: 1 + (i % 4),
  delay: (i * 0.23) % 4,
  duration: 1.2 + (i % 5) * 0.35,
  shape: i % 5 === 0 ? 'star' : 'dot' as 'star' | 'dot',
}));

function TwinklingStars() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true" suppressHydrationWarning>
      {STARS.map((star) => (
        <div
          key={star.id}
          suppressHydrationWarning
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
