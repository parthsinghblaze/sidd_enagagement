'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CoverScreen from '@/components/CoverScreen';
import CardOpenTransition from '@/components/CardOpenTransition';
import FloatingPetals from '@/components/FloatingPetals';
import InvitationText from '@/components/InvitationText';
import VenueDetails from '@/components/VenueDetails';
import MusicPlayer from '@/components/MusicPlayer';
import RingsIllustration from '@/components/RingsIllustration';



type Stage = 'cover' | 'opening' | 'main';

// Confetti burst particles on reveal
function ConfettiBurst() {
  const particles = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    color: ['#D4AF37', '#F1D9A0', '#F6DDE3', '#FFF8F0', '#D4AF37', '#E8C4D0', '#B8960C'][Math.floor(Math.random() * 7)],
    duration: 1.8 + Math.random() * 2,
    delay: Math.random() * 0.8,
    rotate: Math.random() * 900,
    size: 4 + Math.random() * 8,
    shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'rect' : 'diamond',
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-10px',
            width: p.shape === 'circle' ? p.size : p.size * 0.6,
            height: p.shape === 'circle' ? p.size : p.size * (p.shape === 'rect' ? 0.35 : 0.6),
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'diamond' ? '2px' : 3,
            background: p.color,
            animationName: 'confetti-fall',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            animationFillMode: 'forwards',
            transform: `rotate(${p.rotate}deg)`,
            boxShadow: `0 0 ${p.size}px ${p.color}66`,
          }}
        />
      ))}
    </div>
  );
}

function GuestBanner({ name }: { name: string }) {
  return (
    <motion.div
      className="text-center pt-10 pb-2 px-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7 }}
    >
      <p
        className="font-script text-gold-shimmer"
        style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)' }}
      >
        Dear {name},
      </p>
    </motion.div>
  );
}

// Background decorative mandala
function BackgroundMandala() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-5"
      aria-hidden="true"
    >
      <svg width="600" height="600" viewBox="0 0 600 600" fill="none">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 12;
          return (
            <g key={i} transform={`rotate(${i * 30} 300 300)`}>
              <ellipse cx={300} cy={120} rx={18} ry={50} fill="#D4AF37" opacity="0.6" />
              <circle cx={300} cy={80} r={8} fill="#F1D9A0" opacity="0.8" />
            </g>
          );
        })}
        {[40, 80, 120, 160, 200, 240].map((r, i) => (
          <circle key={i} cx={300} cy={300} r={r} stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity={0.4 - i * 0.05} />
        ))}
      </svg>
    </div>
  );
}

export default function InvitationPage() {
  const [stage, setStage] = useState<Stage>('cover');
  const [showConfetti, setShowConfetti] = useState(false);
  const [coverTapped, setCoverTapped] = useState(false);
  const [cardOpened, setCardOpened] = useState(false);
  const [guestName, setGuestName] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);


  // Read ?to= query param for guest personalization
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get('to');
    if (toParam) setGuestName(decodeURIComponent(toParam));
  }, []);

  const handleCoverTap = () => {
    setCoverTapped(true);
    setStage('opening');
  };

  const handleTransitionComplete = () => {
    setStage('main');
    setCardOpened(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  return (
    <LanguageProvider>
      <div
        className="relative w-full min-h-screen overflow-x-hidden"
        style={{ background: 'linear-gradient(160deg, #1a0810 0%, #2d0d18 50%, #1a0810 100%)' }}
      >
        {/* Floating petals — always present */}
        <FloatingPetals count={16} />

        {/* Background mandala watermark — visible in main stage */}
        {stage === 'main' && <BackgroundMandala />}

        {/* Language switcher — always visible, top-right */}
        <div className="fixed top-4 right-4 z-[100]">
          <LanguageSwitcher />
        </div>

        {/* Music player — auto-starts when card opens */}
        <MusicPlayer triggerPlay={coverTapped} autoPlay={cardOpened} />

        {/* ── STAGE: COVER ── */}
        <AnimatePresence mode="wait">
          {stage === 'cover' && (
            <motion.div
              key="cover"
              className="full-screen"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CoverScreen onOpen={handleCoverTap} guestName={guestName ?? undefined} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STAGE: OPENING TRANSITION ── */}
        <AnimatePresence>
          {stage === 'opening' && (
            <CardOpenTransition onComplete={handleTransitionComplete} />
          )}
        </AnimatePresence>

        {/* ── STAGE: MAIN (ring + details) ── */}
        <AnimatePresence>
          {stage === 'main' && (
            <motion.div
              key="main"
              className="w-full min-h-screen flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              ref={mainRef}
            >
              {/* Guest name banner */}
              {guestName && <GuestBanner name={guestName} />}

              {/* Engagement rings illustration */}
              <div className="w-full" style={{ maxWidth: 420, margin: '32px auto 0' }}>
                <RingsIllustration />
              </div>

              {/* Invitation text (stagger reveal) */}
              <div className="w-full" style={{ maxWidth: 520, margin: '0 auto' }}>
                <InvitationText />
              </div>

              {/* Ornamental divider */}
              <div className="w-full ornamental-divider" style={{ maxWidth: 480, margin: '0 auto 40px', padding: '0 32px' }} />

              {/* Venue details — full width, self-centering */}
              <div className="w-full">
                <VenueDetails />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti burst on ring reveal */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              key="confetti"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 2.5 }}
            >
              <ConfettiBurst />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LanguageProvider>
  );
}
