'use client';

import { motion, type Variants } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const EASE_SILK: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_SILK },
  },
};

function DetailRow({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
      >
        <Icon size={18} color="#D4AF37" />
      </div>
      <div className="flex flex-col gap-0.5">
        <p
          className="font-body uppercase tracking-widest"
          style={{ fontSize: '0.6rem', color: 'rgba(212,175,55,0.6)', letterSpacing: '0.18em' }}
        >
          {label}
        </p>
        <p className="font-serif" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: 'var(--color-warm-white)', fontWeight: 500 }}>
          {value}
        </p>
        {subValue && (
          <p className="font-body" style={{ fontSize: '0.8rem', color: 'rgba(253,246,236,0.55)' }}>
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}

function GoldButton({
  id,
  children,
  onClick,
  disabled = false,
  variant = 'primary',
}: {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <motion.button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2 rounded-full font-body text-sm font-medium tracking-wide transition-opacity"
      style={{
        padding: '13px 24px',
        minHeight: 48,
        background:
          variant === 'primary'
            ? 'linear-gradient(135deg, #D4AF37, #F1D9A0, #D4AF37)'
            : 'rgba(122,31,43,0.4)',
        color: variant === 'primary' ? '#1a0810' : 'var(--color-gold-light)',
        border: variant === 'secondary' ? '1px solid rgba(212,175,55,0.4)' : 'none',
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundSize: '200% 200%',
        animation: variant === 'primary' && !disabled ? 'shimmer 3s ease infinite' : 'none',
      }}
      whileHover={!disabled ? { scale: 1.03 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
    >
      {children}
    </motion.button>
  );
}

export default function VenueDetails() {
  const { t, lang } = useLanguage();
  const isHindi = lang === 'hi';
  const isGujarati = lang === 'gu';
  const scriptClass = isHindi ? 'font-devanagari' : isGujarati ? 'font-gujarati' : 'font-body';

  const handleShare = () => {
    const text = t('share_message');
    const url = `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + window.location.href)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRSVP = () => {
    // Placeholder Google Form link
    window.open('https://forms.google.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="venue-details"
      className="w-full max-w-lg mx-auto px-4 pb-28"
      aria-label="Event details"
    >
      {/* Section heading */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
      >
        <p
          className="font-script text-gold-shimmer"
          style={{ fontSize: 'clamp(2.2rem, 8vw, 3rem)' }}
        >
          Join the Celebration
        </p>
        <div className="ornamental-divider w-40 mx-auto mt-3" />
      </motion.div>

      {/* Details card */}
      <motion.div
        className="glass-card overflow-hidden"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {/* Card top gold bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, #F1D9A0, #D4AF37, transparent)' }}
        />

        <div className="px-6 pt-4 pb-2 divide-y" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
          <DetailRow
            icon={Calendar}
            label={t('date_label')}
            value={t('date_value')}
          />
          <DetailRow
            icon={Clock}
            label={t('time_label')}
            value={t('time_value')}
          />
          <DetailRow
            icon={MapPin}
            label={t('venue_label')}
            value={t('venue_name')}
            subValue={t('venue_address')}
          />
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 pt-4 flex flex-col gap-3">
          <GoldButton id="add-to-calendar-btn" disabled>
            <Calendar size={16} />
            <span className={scriptClass}>{t('add_to_calendar')}</span>
          </GoldButton>

          <div className="grid grid-cols-2 gap-3">
            <GoldButton id="rsvp-btn" variant="secondary" onClick={handleRSVP}>
              <ExternalLink size={15} />
              <span className={scriptClass}>{t('rsvp')}</span>
            </GoldButton>
            <GoldButton id="whatsapp-share-btn" variant="secondary" onClick={handleShare}>
              <Share2 size={15} />
              <span className={scriptClass}>{t('share_whatsapp')}</span>
            </GoldButton>
          </div>
        </div>

        {/* Card bottom gold bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, #F1D9A0, #D4AF37, transparent)' }}
        />
      </motion.div>

      {/* Footer */}
      <motion.p
        className="text-center mt-10 font-script"
        style={{ fontSize: '1.4rem', color: 'rgba(212,175,55,0.5)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        With love &amp; joy ✨
      </motion.p>
    </section>
  );
}
