'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import gu from '@/locales/gu.json';

type Lang = 'en' | 'hi' | 'gu';
type Translations = typeof en;

const dictionaries: Record<Lang, Translations> = { en, hi, gu };

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Translations, vars?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  // Always default to English on load — user can switch via dropdown

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('sidd_lang', l);
  }, []);

  const t = useCallback(
    (key: keyof Translations, vars?: Record<string, string>) => {
      let str = dictionaries[lang][key] as string;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, v);
        });
      }
      return str;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
