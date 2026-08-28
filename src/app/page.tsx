'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CoverScreen from '@/components/CoverScreen';
import CardOpenTransition from '@/components/CardOpenTransition';
import FloatingPetals from '@/components/FloatingPetals';
import InvitationText from '@/components/InvitationText';
import VenueDetails from '@/components/VenueDetails';
import MusicPlayer from '@/components/MusicPlayer';

// Lazy-load the 3D ring scene (Three.js is heavy — only load after card opens)
const RingScene = dynamic(() => import('@/components/RingScene'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full flex items-center justify-center skeleton rounded-full mx-auto"
      style={{ height: 280, maxWidth: 280 }}
    />
  ),
});

type Stage = 'cover' | 'opening' | 'main';

// Confetti burst particles on ring reveal
function ConfettiBurst() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: 30 + Math.random() * 40,
    color: ['#D4AF37', '#F1D9A0', '#F6DDE3', '#FFF8F0', '#D4AF37'][Math.floor(Math.random() * 5)],
    duration: 1.5 + Math.random() * 1.5,
    delay: Math.random() * 0.5,
    rotate: Math.random() * 720,
    size: 4 + Math.random() * 6,
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
            width: p.size,
            height: p.size * 0.4,
            borderRadius: 2,
            background: p.color,
            animationName: 'confetti-fall',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            animationFillMode: 'forwards',
            transform: `rotate(${p.rotate}deg)`,
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
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
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

        {/* Music player — always present after first tap */}
        <MusicPlayer triggerPlay={coverTapped} />

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
              className="w-full min-h-screen flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              ref={mainRef}
            >
              {/* Guest name banner */}
              {guestName && <GuestBanner name={guestName} />}

              {/* Ring scene */}
              <div className="w-full max-w-lg mx-auto mt-10">
                <RingScene />
              </div>

              {/* Invitation text (stagger reveal) */}
              <div className="w-full max-w-lg mx-auto">
                <InvitationText />
              </div>

              {/* Ornamental divider */}
              <div className="w-full max-w-lg mx-auto px-8 mb-10">
                <div className="ornamental-divider" />
              </div>

              {/* Venue details */}
              <div className="w-full max-w-lg mx-auto">
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
