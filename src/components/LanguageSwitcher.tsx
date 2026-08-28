'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
}

const LANGS = [
  { code: 'en' as const, label: 'EN' },
  { code: 'hi' as const, label: 'हिं' },
  { code: 'gu' as const, label: 'ગુજ' },
];

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`flex items-center gap-1 p-1 rounded-full glass-card ${className}`}
      style={{
        background: 'rgba(26, 8, 16, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(212,175,55,0.35)',
      }}
    >
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          id={`lang-btn-${code}`}
          onClick={() => setLang(code)}
          className="relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200"
          style={{
            fontFamily: code === 'hi' ? 'var(--font-devanagari)' : code === 'gu' ? 'var(--font-gujarati)' : 'var(--font-body)',
            color: lang === code ? '#1a0810' : 'rgba(241,217,160,0.7)',
            minHeight: '32px',
          }}
          aria-label={`Switch to ${code === 'en' ? 'English' : code === 'hi' ? 'Hindi' : 'Gujarati'}`}
          aria-pressed={lang === code}
        >
          <AnimatePresence>
            {lang === code && (
              <motion.span
                key="pill"
                layoutId="lang-active-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #F1D9A0)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </AnimatePresence>
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  );
}
