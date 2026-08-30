'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const LANGS = [
  { code: 'en' as const, label: 'English', short: 'EN' },
  { code: 'hi' as const, label: 'हिन्दी', short: 'HI' },
  { code: 'gu' as const, label: 'ગુજરાતી', short: 'GU' },
];

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ zIndex: 200 }}>
      {/* Trigger button */}
      <motion.button
        id="lang-switcher-btn"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className="flex items-center gap-1.5 px-5 py-2 rounded-full"
        style={{
          background: 'rgba(26, 8, 16, 0.75)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(212,175,55,0.45)',
          boxShadow: open
            ? '0 0 14px rgba(212,175,55,0.25)'
            : '0 2px 10px rgba(0,0,0,0.35)',
          transition: 'box-shadow 0.3s',
          minHeight: 36,
          padding: "0 10px"
        }}
      >
        {/* Globe icon */}
        <svg
          width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="rgba(212,175,55,0.8)" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>

        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            color: 'rgba(241,217,160,0.9)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {current.short}
        </span>

        {/* Chevron */}
        <motion.svg
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="rgba(212,175,55,0.6)" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Language options"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              minWidth: 130,
              background: 'rgba(22, 6, 14, 0.96)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(212,175,55,0.35)',
              borderRadius: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,175,55,0.1)',
              overflow: 'hidden',
              listStyle: 'none',
              padding: '4px 0',
            }}
          >
            {LANGS.map(({ code, label, short }) => {
              const isActive = lang === code;
              const fontFamily =
                code === 'hi' ? 'var(--font-devanagari)'
                  : code === 'gu' ? 'var(--font-gujarati)'
                    : 'var(--font-body)';

              return (
                <motion.li
                  key={code}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => { setLang(code); setOpen(false); }}
                  whileHover={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 14px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'rgba(212,175,55,0.14)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Active dot */}
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: isActive ? '#D4AF37' : 'transparent',
                      border: isActive ? 'none' : '1px solid rgba(212,175,55,0.25)',
                      transition: 'background 0.2s',
                    }}
                  />

                  {/* Short code */}
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: isActive ? '#D4AF37' : 'rgba(212,175,55,0.4)',
                      fontFamily: 'var(--font-body)',
                      minWidth: 18,
                    }}
                  >
                    {short}
                  </span>

                  {/* Full label */}
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontFamily,
                      color: isActive ? 'rgba(253,246,236,0.95)' : 'rgba(253,246,236,0.6)',
                      fontWeight: isActive ? 500 : 400,
                      lineHeight: 1.6,
                    }}
                  >
                    {label}
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
