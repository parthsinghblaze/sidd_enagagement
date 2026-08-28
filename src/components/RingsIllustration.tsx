'use client';

import { motion } from 'framer-motion';

// Decorative interlocking rings with gold shimmer — replaces the 3D ring
export default function RingsIllustration() {
  return (
    <motion.div
      className="flex items-center justify-center w-full py-6"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, type: 'spring', stiffness: 70, damping: 18 }}
    >
      <svg
        viewBox="0 0 320 200"
        width="100%"
        style={{ maxWidth: 340, overflow: 'visible' }}
        aria-label="Two interlocking engagement rings"
      >
        <defs>
          {/* Gold gradient for left ring */}
          <linearGradient id="goldL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8960C" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="60%" stopColor="#F1D9A0" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          {/* Gold gradient for right ring */}
          <linearGradient id="goldR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="40%" stopColor="#F1D9A0" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B8960C" />
          </linearGradient>
          {/* Gem gradient */}
          <radialGradient id="gemGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#E8F4FF" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#A8C8F0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7090B0" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id="gemGrad2" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#FFE8F0" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#F0B8C8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C08090" stopOpacity="0.3" />
          </radialGradient>
          {/* Sparkle glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Soft ambient glow behind rings ── */}
        <ellipse cx="130" cy="100" rx="70" ry="50" fill="#D4AF37" opacity="0.06" />
        <ellipse cx="190" cy="100" rx="70" ry="50" fill="#D4AF37" opacity="0.06" />

        {/* ── LEFT RING (his) ── */}
        {/* Outer band */}
        <motion.circle
          cx="130" cy="100" r="62"
          fill="none"
          stroke="url(#goldL)"
          strokeWidth="16"
          filter="url(#softGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        />
        {/* Inner highlight */}
        <circle cx="130" cy="100" r="62" fill="none" stroke="#F1D9A0" strokeWidth="2" opacity="0.35" />
        {/* Inner shadow */}
        <circle cx="130" cy="100" r="55" fill="none" stroke="#7A4F00" strokeWidth="2" opacity="0.2" />

        {/* ── RIGHT RING (hers) ── */}
        {/* Outer band */}
        <motion.circle
          cx="190" cy="100" r="62"
          fill="none"
          stroke="url(#goldR)"
          strokeWidth="16"
          filter="url(#softGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.45 }}
        />
        <circle cx="190" cy="100" r="62" fill="none" stroke="#F1D9A0" strokeWidth="2" opacity="0.35" />
        <circle cx="190" cy="100" r="55" fill="none" stroke="#7A4F00" strokeWidth="2" opacity="0.2" />

        {/* ── GEM on right ring (top center) ── */}
        {/* Setting prongs */}
        <g opacity="0.9" filter="url(#glow)">
          <rect x="183" y="32" width="3" height="8" rx="1.5" fill="url(#goldR)" />
          <rect x="192" y="32" width="3" height="8" rx="1.5" fill="url(#goldR)" />
          <rect x="179" y="37" width="8" height="3" rx="1.5" fill="url(#goldR)" />
          <rect x="191" y="37" width="8" height="3" rx="1.5" fill="url(#goldR)" />
        </g>
        {/* Gem stone — diamond shape */}
        <polygon
          points="189,28 198,38 189,48 180,38"
          fill="url(#gemGrad2)"
          filter="url(#glow)"
          opacity="0.95"
        />
        {/* Gem facets */}
        <polygon points="189,28 198,38 189,38" fill="white" opacity="0.3" />
        <polygon points="189,28 180,38 189,38" fill="white" opacity="0.1" />
        {/* Gem sparkle */}
        <line x1="189" y1="24" x2="189" y2="30" stroke="white" strokeWidth="1.5" opacity="0.8" />
        <line x1="185" y1="26" x2="193" y2="34" stroke="white" strokeWidth="1" opacity="0.5" />

        {/* ── GEM on left ring (top center) ── */}
        <g opacity="0.85" filter="url(#glow)">
          <rect x="123" y="32" width="3" height="8" rx="1.5" fill="url(#goldL)" />
          <rect x="132" y="32" width="3" height="8" rx="1.5" fill="url(#goldL)" />
          <rect x="119" y="37" width="8" height="3" rx="1.5" fill="url(#goldL)" />
          <rect x="131" y="37" width="8" height="3" rx="1.5" fill="url(#goldL)" />
        </g>
        <polygon
          points="129,28 138,38 129,48 120,38"
          fill="url(#gemGrad)"
          filter="url(#glow)"
          opacity="0.9"
        />
        <polygon points="129,28 138,38 129,38" fill="white" opacity="0.35" />
        <polygon points="129,28 120,38 129,38" fill="white" opacity="0.1" />
        <line x1="129" y1="24" x2="129" y2="30" stroke="white" strokeWidth="1.5" opacity="0.7" />

        {/* ── SPARKLE PARTICLES ── */}
        {[
          { cx: 60, cy: 55, r: 2.5, delay: 0 },
          { cx: 82, cy: 160, r: 1.8, delay: 0.4 },
          { cx: 240, cy: 48, r: 2, delay: 0.7 },
          { cx: 260, cy: 155, r: 2.5, delay: 0.2 },
          { cx: 160, cy: 175, r: 1.5, delay: 0.9 },
          { cx: 48, cy: 110, r: 1.5, delay: 0.5 },
          { cx: 275, cy: 100, r: 2, delay: 0.3 },
          { cx: 160, cy: 20, r: 2.5, delay: 0.6 },
        ].map((s, i) => (
          <motion.circle
            key={i}
            cx={s.cx} cy={s.cy} r={s.r}
            fill="#F1D9A0"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2 + i * 0.3, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* ── 4-pointed star sparkles ── */}
        {[
          { x: 55, y: 50 }, { x: 262, y: 148 }, { x: 160, y: 18 },
        ].map((pos, i) => (
          <motion.g
            key={i}
            animate={{ opacity: [0, 1, 0], rotate: [0, 45, 90] }}
            transition={{ duration: 2.5, delay: i * 0.8, repeat: Infinity }}
            style={{ originX: pos.x, originY: pos.y }}
          >
            <line x1={pos.x - 5} y1={pos.y} x2={pos.x + 5} y2={pos.y} stroke="#F1D9A0" strokeWidth="1.5" />
            <line x1={pos.x} y1={pos.y - 5} x2={pos.x} y2={pos.y + 5} stroke="#F1D9A0" strokeWidth="1.5" />
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
}
