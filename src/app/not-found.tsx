import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/global/PageShell';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <PageShell>
      <h1>Page not found</h1>
      <p>This page does not exist.</p>
      <Link href="/">Back to Home</Link>
    </PageShell>
  );
}
