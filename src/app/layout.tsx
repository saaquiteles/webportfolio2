import type { Metadata } from 'next';
import { MAIN_CONTENT_ID } from '@/components/global/PageShell';
import { SiteFooter } from '@/components/global/SiteFooter';
import { SiteHeader } from '@/components/global/SiteHeader';
import { profile } from '@/data/profile';
import { bricolage, inter, jetbrainsMono } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: profile.name,
  description: profile.headline,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a
          href={`#${MAIN_CONTENT_ID}`}
          className="sr-only no-underline focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:border-2 focus:border-ink focus:bg-surface focus:px-4 focus:font-semibold focus:text-ink focus:outline-3 focus:outline-offset-3 focus:outline-blueprint"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
