'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Ornate border SVG — scales with card, uses absolute proportions
function OrnateFrame() {
  return (
    <svg
      viewBox="0 0 360 460"
      fill="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* Outer border */}
      <rect x="6" y="6" width="348" height="448" rx="4" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.5" />
      {/* Inner dashed border */}
      <rect x="14" y="14" width="332" height="432" rx="2" stroke="#D4AF37" strokeWidth="0.4" strokeOpacity="0.3" strokeDasharray="4 3" />

      {/* Corner ornaments — top-left, top-right, bottom-left, bottom-right */}
      {[
        { tx: 6,   ty: 6,   sx: 1,  sy: 1  },
        { tx: 354, ty: 6,   sx: -1, sy: 1  },
        { tx: 6,   ty: 454, sx: 1,  sy: -1 },
        { tx: 354, ty: 454, sx: -1, sy: -1 },
      ].map((c, i) => (
        <g key={i} transform={`translate(${c.tx},${c.ty}) scale(${c.sx},${c.sy})`}>
          <path d="M0,0 L26,0 L26,4 L4,4 L4,26 L0,26 Z" fill="#D4AF37" opacity="0.55" />
          <circle cx="4" cy="4" r="2.5" fill="#D4AF37" opacity="0.75" />
          <path d="M8,0 Q16,8 8,16" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.35" />
        </g>
      ))}

      {/* Top center ornament */}
      <g transform="translate(180,6)">
        <path d="M-16,0 Q-8,9 0,5 Q8,9 16,0" stroke="#D4AF37" strokeWidth="0.8" fill="none" opacity="0.55" />
        <circle cx="0" cy="5" r="2" fill="#D4AF37" opacity="0.65" />
        <circle cx="-10" cy="2" r="1.1" fill="#D4AF37" opacity="0.45" />
        <circle cx="10"  cy="2" r="1.1" fill="#D4AF37" opacity="0.45" />
      </g>
      {/* Bottom center ornament */}
      <g transform="translate(180,454) rotate(180)">
        <path d="M-16,0 Q-8,9 0,5 Q8,9 16,0" stroke="#D4AF37" strokeWidth="0.8" fill="none" opacity="0.55" />
        <circle cx="0" cy="5" r="2" fill="#D4AF37" opacity="0.65" />
        <circle cx="-10" cy="2" r="1.1" fill="#D4AF37" opacity="0.45" />
        <circle cx="10"  cy="2" r="1.1" fill="#D4AF37" opacity="0.45" />
      </g>
    </svg>
  );
}

// Thin ornamental divider with center diamond
function OrnamentalRule({ opacity = 0.45 }: { opacity?: number }) {
  return (
    <div className="flex items-center gap-2 w-full" style={{ opacity }}>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
      <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
        <path d="M6,0 L12,6 L6,12 L0,6 Z" fill="#D4AF37" />
      </svg>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.14,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function VenueDetails() {
  const { t, lang } = useLanguage();
  const isHindi    = lang === 'hi';
  const isGujarati = lang === 'gu';
  const scriptClass = isHindi ? 'font-devanagari' : isGujarati ? 'font-gujarati' : 'font-body';

  const handleDirections = () => {
    window.open(
      'https://www.google.com/maps/place/Atithi+Restaurant+and+Banquet/@20.3675642,72.9237535,17z/data=!3m1!4b1!4m6!3m5!1s0x3be0ce563dfa12db:0x358d416d7392c7f4!8m2!3d20.3675642!4d72.9237535!16s%2Fg%2F1q66sxppm?entry=ttu&g_ep=EgoyMDI2MDgyNS4wIKXMDSoASAFQAw%3D%3D',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section
      id="venue-details"
      aria-label="Event details"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '7rem',
      }}
    >
      {/* ── SECTION HEADING ── */}
      <motion.div
        style={{ textAlign: 'center', marginTop: 16, marginBottom: 32, width: '100%', padding: '0 16px' }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7 }}
      >
        <p
          className="font-script text-gold-shimmer"
          style={{ fontSize: 'clamp(2rem, 7vw, 2.6rem)' }}
        >
          {t('join_celebration')}
        </p>
        <div className="px-6 mt-2">
          <OrnamentalRule />
        </div>
      </motion.div>

      {/* ── INVITATION CARD ──
        Mobile  : 100% viewport width
        ≥ 452px : capped at 420px, centered (margin auto handles it
                  since the section is flex + items-center)
      */}
      <motion.div
        className="relative"
        style={{
          width: '100%',
          maxWidth: 420,
        }}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8 }}
      >
        {/* Inner wrapper — actual card box */}
        <div className="relative w-full" style={{ minHeight: 420 }}>
          {/* Card background */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background:
                'linear-gradient(170deg, rgba(58,14,28,0.94) 0%, rgba(26,8,16,0.98) 55%, rgba(44,11,22,0.96) 100%)',
              backdropFilter: 'blur(24px)',
            }}
          />
          {/* Ornate frame SVG */}
          <OrnateFrame />

          {/* ── Card content — inner padding lives here ── */}
          <div
            className="relative z-10 flex flex-col items-center"
            style={{ padding: '36px 32px', gap: '20px' }}
          >

            {/* DATE */}
            <motion.div
              className="flex flex-col items-center text-center"
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p
                className="font-body uppercase"
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.26em',
                  color: 'rgba(212,175,55,0.5)',
                  marginBottom: 4,
                }}
              >
                {t('date_label')}
              </p>
              <p
                className={`font-script ${scriptClass}`}
                style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', color: '#D4AF37', lineHeight: 1.15 }}
              >
                {t('date_day_name')}
              </p>
              <p
                className="font-serif text-gold-shimmer"
                style={{
                  fontSize: 'clamp(4rem, 16vw, 5.5rem)',
                  fontWeight: 600,
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                }}
              >
                {t('date_day_number')}
              </p>
              <p
                className={scriptClass}
                style={{
                  fontSize: 'clamp(0.88rem, 3.5vw, 1.05rem)',
                  color: 'rgba(253,246,236,0.65)',
                  letterSpacing: '0.07em',
                  marginTop: 2,
                }}
              >
                {t('date_month_year')}
              </p>
            </motion.div>

            {/* DIVIDER */}
            <motion.div
              className="w-full"
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <OrnamentalRule opacity={0.38} />
            </motion.div>

            {/* TIME */}
            <motion.div
              className="flex flex-col items-center text-center"
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p
                className="font-body uppercase"
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.26em',
                  color: 'rgba(212,175,55,0.5)',
                  marginBottom: 6,
                }}
              >
                {t('time_label')}
              </p>
              <p
                className={`font-serif ${scriptClass}`}
                style={{
                  fontSize: 'clamp(1.3rem, 5.5vw, 1.65rem)',
                  color: 'var(--color-warm-white)',
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                }}
              >
                {t('time_value')}
              </p>
            </motion.div>

            {/* DIVIDER */}
            <motion.div
              className="w-full"
              custom={3}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <OrnamentalRule opacity={0.38} />
            </motion.div>

            {/* VENUE */}
            <motion.div
              className="flex flex-col items-center text-center"
              custom={4}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ gap: 6 }}
            >
              <p
                className="font-body uppercase"
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.26em',
                  color: 'rgba(212,175,55,0.5)',
                  marginBottom: 2,
                }}
              >
                {t('venue_label')}
              </p>
              <p
                className={`font-serif ${scriptClass}`}
                style={{
                  fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                  color: 'var(--color-warm-white)',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {t('venue_name')}
              </p>
              <p
                className={scriptClass}
                style={{
                  fontSize: 'clamp(0.7rem, 2.8vw, 0.82rem)',
                  color: 'rgba(253,246,236,0.42)',
                  lineHeight: 1.55,
                }}
              >
                {t('venue_address')}
              </p>

              {/* Get Directions */}
              <motion.button
                id="directions-btn"
                onClick={handleDirections}
                className="flex items-center justify-center gap-1.5 mt-1"
                style={{
                  color: '#D4AF37',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(212,175,55,0.3)',
                  textUnderlineOffset: '3px',
                  minHeight: 36,
                }}
                whileHover={{ color: '#F1D9A0' }}
                whileTap={{ scale: 0.97 }}
              >
                <MapPin size={11} />
                {t('get_directions')}
              </motion.button>
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* ── FOOTER ── */}
      <motion.div
        className="text-center mt-10 flex flex-col items-center gap-3 px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
      >
        <OrnamentalRule opacity={0.2} />
        <p
          className="font-script"
          style={{ fontSize: 'clamp(1.1rem, 4.5vw, 1.4rem)', color: 'rgba(212,175,55,0.38)' }}
        >
          {t('with_love')} ✨
        </p>
      </motion.div>
    </section>
  );
}
