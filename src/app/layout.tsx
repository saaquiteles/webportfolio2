import type { Metadata } from 'next';
import { profile } from '@/data/profile';
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
