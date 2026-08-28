'use client';

import { motion, type Variants } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const EASE_SILK: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.22, delayChildren: 0.3 },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE_SILK },
  },
};

// Floral vine divider SVG
function FloralDivider() {
  return (
    <svg width="200" height="24" viewBox="0 0 200 24" fill="none" style={{ opacity: 0.75 }}>
      <path d="M0,12 Q50,2 100,12 Q150,22 200,12" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
      {[30, 70, 100, 130, 170].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={12} r="2" fill="#D4AF37" opacity={0.8} />
          <circle cx={x} cy={12 - 5} r="1.2" fill="#F6DDE3" opacity={0.6} />
        </g>
      ))}
    </svg>
  );
}

export default function InvitationText() {
  const { t, lang } = useLanguage();

  const isHindi = lang === 'hi';
  const isGujarati = lang === 'gu';
  const scriptClass = isHindi ? 'font-devanagari' : isGujarati ? 'font-gujarati' : 'font-body';

  return (
    <motion.div
      className="flex flex-col items-center text-center px-6 py-8 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* "Together with their families" */}
      <motion.p
        className={`${scriptClass} tracking-widest uppercase`}
        style={{
          fontSize: 'clamp(0.65rem, 2.5vw, 0.8rem)',
          color: 'rgba(241,217,160,0.7)',
          letterSpacing: '0.2em',
        }}
        variants={lineVariants}
      >
        {t('together_with_families')}
      </motion.p>

      <motion.div variants={lineVariants}>
        <FloralDivider />
      </motion.div>

      {/* Couple names */}
      <motion.div className="flex flex-col items-center gap-1" variants={lineVariants}>
        <h1
          className="font-serif text-gold-shimmer"
          style={{
            fontSize: 'clamp(3rem, 13vw, 5.5rem)',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          {t('groom_name')}
        </h1>

        <p
          className="font-script"
          style={{
            fontSize: 'clamp(2rem, 8vw, 3.2rem)',
            color: 'var(--color-gold)',
            lineHeight: 1.1,
          }}
        >
          &amp;
        </p>

        <h1
          className="font-serif text-gold-shimmer"
          style={{
            fontSize: 'clamp(3rem, 13vw, 5.5rem)',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          {t('bride_name')}
        </h1>
      </motion.div>

      <motion.div variants={lineVariants}>
        <FloralDivider />
      </motion.div>

      {/* Invite line */}
      <motion.p
        className={`${scriptClass} max-w-xs`}
        style={{
          fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
          color: 'rgba(253,246,236,0.85)',
          lineHeight: 1.75,
          fontWeight: 300,
        }}
        variants={lineVariants}
      >
        {t('invite_line')}
      </motion.p>

      {/* Decorative rings emoji accent */}
      <motion.p
        style={{ fontSize: '1.5rem', letterSpacing: '0.4em', marginTop: 8, marginBottom: 40 }}
        variants={lineVariants}
        aria-hidden="true"
      >
        💍✨💍
      </motion.p>
    </motion.div>
  );
}
