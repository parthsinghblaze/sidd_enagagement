'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface CardOpenTransitionProps {
  onComplete: () => void;
}

// Easing that feels like silk/paper unfolding
const SILK_EASE = [0.76, 0, 0.24, 1] as const;

export default function CardOpenTransition({ onComplete }: CardOpenTransitionProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      style={{ background: '#1a0810' }}
    >
      {/* LEFT HALF */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full overflow-hidden"
        style={{ originX: 0 }}
        initial={{ x: 0 }}
        animate={{ x: '-100%' }}
        transition={{ duration: 1.1, ease: SILK_EASE, delay: 0.15 }}
      >
        <div className="relative w-[200%] h-full" style={{ left: 0 }}>
          <Image
            src="/illustrations/cover.png"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: 'left center', opacity: 0.85 }}
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, rgba(26,8,16,0.5) 0%, rgba(26,8,16,0.15) 60%, rgba(26,8,16,0.8) 100%)',
            }}
          />
          {/* Gold crease shadow on right edge */}
          <div
            className="absolute top-0 right-0 w-8 h-full"
            style={{
              background: 'linear-gradient(to left, rgba(212,175,55,0.6), transparent)',
              boxShadow: 'inset -6px 0 18px rgba(0,0,0,0.6)',
            }}
          />
        </div>
      </motion.div>

      {/* RIGHT HALF */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full overflow-hidden"
        style={{ originX: 1 }}
        initial={{ x: 0 }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.1, ease: SILK_EASE, delay: 0.15 }}
        onAnimationComplete={onComplete}
      >
        <div className="relative w-[200%] h-full" style={{ right: 0, position: 'absolute' }}>
          <Image
            src="/illustrations/cover.png"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: 'right center', opacity: 0.85 }}
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, rgba(26,8,16,0.5) 0%, rgba(26,8,16,0.15) 60%, rgba(26,8,16,0.8) 100%)',
            }}
          />
          {/* Gold crease shadow on left edge */}
          <div
            className="absolute top-0 left-0 w-8 h-full"
            style={{
              background: 'linear-gradient(to right, rgba(212,175,55,0.6), transparent)',
              boxShadow: 'inset 6px 0 18px rgba(0,0,0,0.6)',
            }}
          />
        </div>
      </motion.div>

      {/* Center gold seam line that splits */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full"
        style={{ background: 'linear-gradient(to bottom, transparent, #D4AF37, #F1D9A0, #D4AF37, transparent)', zIndex: 60 }}
        initial={{ opacity: 1, scaleY: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      />

      {/* Flash of light as card opens */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(241,217,160,0.15)', zIndex: 70 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 0.5, delay: 0.6 }}
      />
    </motion.div>
  );
}
