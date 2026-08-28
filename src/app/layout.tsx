import type { Metadata } from 'next';
import {
  Cormorant_Garamond,
  Great_Vibes,
  Poppins,
  Noto_Sans_Devanagari,
  Noto_Sans_Gujarati,
} from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const greatVibes = Great_Vibes({
  variable: '--font-great-vibes',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: '--font-noto-devanagari',
  subsets: ['devanagari'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const notoGujarati = Noto_Sans_Gujarati({
  variable: '--font-noto-gujarati',
  subsets: ['gujarati'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Siddharth & Khushi — Engagement Invitation",
  description: "Together with their families, Siddharth & Khushi invite you to celebrate their engagement. A premium digital invitation.",
  openGraph: {
    title: "Siddharth & Khushi — Engagement 💍",
    description: "You're invited to celebrate our engagement! Sunday, 7th December 2026 · Atithi Restaurant and Banquet, Vapi",
    type: "website",
    images: [{ url: '/favicon.png', width: 512, height: 512, alt: 'Engagement Ring' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        ${cormorant.variable}
        ${greatVibes.variable}
        ${poppins.variable}
        ${notoDevanagari.variable}
        ${notoGujarati.variable}
        h-full
      `}
    >
      <body className="min-h-full" suppressHydrationWarning>{children}</body>
    </html>
  );
}
