import type { Metadata } from 'next';
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
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
