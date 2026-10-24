import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TODO(human): site title',
  description: 'TODO(human): site description',
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
