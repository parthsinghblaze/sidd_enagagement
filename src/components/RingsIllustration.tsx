'use client';

import { motion } from 'framer-motion';

// Elegant interlocked engagement rings: Small delicate gold bands + Large sparkling Solitaire Diamonds
export default function RingsIllustration() {
  return (
    <motion.div
      className="flex items-center justify-center w-full py-4 relative"
      initial={{ opacity: 0, scale: 0.7, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="w-full flex justify-center"
        animate={{ y: [-4, 4, -4], rotate: [-0.5, 0.5, -0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          viewBox="0 0 340 220"
          width="100%"
          style={{ maxWidth: 360, overflow: 'visible' }}
          aria-label="Interlocking gold engagement rings illustration"
        >
          <defs>
            {/* Rich 24K Gold Gradient Left */}
            <linearGradient id="goldL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#997008" />
              <stop offset="25%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#FFF2B2" />
              <stop offset="75%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8A6305" />
            </linearGradient>

            {/* Rich 24K Gold Gradient Right */}
            <linearGradient id="goldR" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8A6305" />
              <stop offset="30%" stopColor="#D4AF37" />
              <stop offset="60%" stopColor="#FFF2B2" />
              <stop offset="85%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#997008" />
            </linearGradient>

            {/* Large Diamond Crystal Blue/White Gradient */}
            <radialGradient id="gemGradLeft" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#F0F9FF" />
              <stop offset="65%" stopColor="#BAE6FD" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.5" />
            </radialGradient>

            {/* Large Diamond Rose/White Gradient */}
            <radialGradient id="gemGradRight" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FFF1F2" />
              <stop offset="65%" stopColor="#FECDD3" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FB7185" stopOpacity="0.5" />
            </radialGradient>

            {/* Aura Glow filter */}
            <filter id="auraGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Intense Diamond Sparkle Glow */}
            <filter id="sparkleGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── LEFT RING (DELICATE SMALLER GOLD BAND) ── */}
          <g transform="translate(142, 118)">
            {/* Soft Shadow */}
            <circle cx="0" cy="6" r="38" fill="none" stroke="#3A0812" strokeWidth="10" opacity="0.4" filter="url(#auraGlow)" />

            {/* Main Delicate Gold Band */}
            <motion.circle
              cx="0"
              cy="0"
              r="38"
              fill="none"
              stroke="url(#goldL)"
              strokeWidth="9"
              filter="url(#auraGlow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, delay: 0.2, ease: 'easeInOut' }}
            />

            {/* Inner Gold Rim Highlight */}
            <circle cx="0" cy="0" r="43" fill="none" stroke="#FFF2B2" strokeWidth="1" opacity="0.65" />
            <circle cx="0" cy="0" r="33" fill="none" stroke="#664600" strokeWidth="0.8" opacity="0.35" />

            {/* ── LARGE SOLITAIRE DIAMOND GEM ON LEFT RING ── */}
            <g transform="translate(0, -38)">
              {/* Crown Prongs */}
              <rect x="-10" y="-8" width="3.5" height="10" rx="1" fill="url(#goldL)" />
              <rect x="6.5" y="-8" width="3.5" height="10" rx="1" fill="url(#goldL)" />
              <rect x="-13" y="-3" width="7" height="3.5" rx="1" fill="url(#goldL)" />
              <rect x="6" y="-3" width="7" height="3.5" rx="1" fill="url(#goldL)" />

              {/* Large Solitaire Diamond Polygon */}
              <polygon points="0,-22 14,-5 0,8 -14,-5" fill="url(#gemGradLeft)" filter="url(#sparkleGlow)" />
              {/* Facet Highlights */}
              <polygon points="0,-22 14,-5 0,-5" fill="#FFFFFF" opacity="0.6" />
              <polygon points="0,-22 -14,-5 0,-5" fill="#FFFFFF" opacity="0.25" />
              <polygon points="0,-22 0,8" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />

              {/* Diamond Glint Burst */}
              <motion.g
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.2, 0.85] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <line x1="0" y1="-30" x2="0" y2="-14" stroke="#FFFFFF" strokeWidth="2" />
                <line x1="-8" y1="-22" x2="8" y2="-22" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="0" cy="-22" r="3" fill="#FFFFFF" />
              </motion.g>
            </g>
          </g>

          {/* ── RIGHT RING (DELICATE SMALLER GOLD BAND) ── */}
          <g transform="translate(198, 118)">
            {/* Soft Shadow */}
            <circle cx="0" cy="6" r="38" fill="none" stroke="#3A0812" strokeWidth="10" opacity="0.4" filter="url(#auraGlow)" />

            {/* Main Delicate Gold Band */}
            <motion.circle
              cx="0"
              cy="0"
              r="38"
              fill="none"
              stroke="url(#goldR)"
              strokeWidth="9"
              filter="url(#auraGlow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, delay: 0.45, ease: 'easeInOut' }}
            />

            {/* Inner Gold Rim Highlight */}
            <circle cx="0" cy="0" r="43" fill="none" stroke="#FFF2B2" strokeWidth="1" opacity="0.65" />
            <circle cx="0" cy="0" r="33" fill="none" stroke="#664600" strokeWidth="0.8" opacity="0.35" />

            {/* ── LARGE SOLITAIRE DIAMOND GEM ON RIGHT RING ── */}
            <g transform="translate(0, -38)">
              {/* Crown Prongs */}
              <rect x="-11" y="-9" width="4" height="11" rx="1" fill="url(#goldR)" />
              <rect x="7" y="-9" width="4" height="11" rx="1" fill="url(#goldR)" />
              <rect x="-15" y="-3" width="8" height="4" rx="1" fill="url(#goldR)" />
              <rect x="7" y="-3" width="8" height="4" rx="1" fill="url(#goldR)" />

              {/* Extra Large Solitaire Diamond Gem */}
              <polygon points="0,-26 16,-6 0,9 -16,-6" fill="url(#gemGradRight)" filter="url(#sparkleGlow)" />
              {/* Facet Highlights */}
              <polygon points="0,-26 16,-6 0,-6" fill="#FFFFFF" opacity="0.65" />
              <polygon points="0,-26 -16,-6 0,-6" fill="#FFFFFF" opacity="0.25" />
              <polygon points="0,-26 0,9" stroke="#FFFFFF" strokeWidth="1" opacity="0.45" />

              {/* Bright Diamond Glint Star Burst */}
              <motion.g
                animate={{ opacity: [0.3, 1, 0.3], rotate: [0, 45, 90] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                style={{ transformOrigin: '0px -26px' }}
              >
                <line x1="0" y1="-35" x2="0" y2="-17" stroke="#FFFFFF" strokeWidth="2.5" />
                <line x1="-9" y1="-26" x2="9" y2="-26" stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx="0" cy="-26" r="4" fill="#FFFFFF" />
              </motion.g>
            </g>
          </g>

          {/* ── FLOATING ORBITING GOLD SPARKLES ── */}
          {[
            { cx: 75,  cy: 80,  r: 2.5, delay: 0 },
            { cx: 95,  cy: 165, r: 2.0, delay: 0.4 },
            { cx: 265, cy: 75,  r: 2.8, delay: 0.8 },
            { cx: 275, cy: 155, r: 2.2, delay: 0.3 },
            { cx: 170, cy: 195, r: 2.5, delay: 1.1 },
            { cx: 170, cy: 25,  r: 3.2, delay: 0.6 },
            { cx: 50,  cy: 120, r: 2.0, delay: 0.9 },
            { cx: 290, cy: 115, r: 2.4, delay: 0.2 },
          ].map((s, i) => (
            <motion.circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="#FFF2B2"
              filter="url(#sparkleGlow)"
              animate={{
                opacity: [0.1, 1, 0.1],
                scale: [0.6, 1.4, 0.6],
                y: [0, -6, 0],
              }}
              transition={{
                duration: 2.4 + i * 0.3,
                delay: s.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* ── 4-POINTED ELEGANT SHIMMER STARS ── */}
          {[
            { x: 70, y: 55, scale: 1.0, delay: 0 },
            { x: 270, y: 145, scale: 1.2, delay: 0.7 },
            { x: 170, y: 18, scale: 1.4, delay: 1.2 },
          ].map((star, i) => (
            <motion.g
              key={i}
              transform={`translate(${star.x}, ${star.y}) scale(${star.scale})`}
              animate={{ opacity: [0.2, 1, 0.2], rotate: [0, 90, 180] }}
              transition={{ duration: 3.2, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d="M0,-8 Q0,0 8,0 Q0,0 0,8 Q0,0 -8,0 Q0,0 0,-8 Z" fill="#FFF2B2" filter="url(#sparkleGlow)" />
            </motion.g>
          ))}
        </svg>
      </motion.div>
    </motion.div>
  );
}
