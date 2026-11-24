import type { Metadata } from 'next';
import { PageShell } from '@/components/global/PageShell';
import { ContactLinks } from '@/components/sections/ContactLinks';
import { profile } from '@/data/profile';

export const metadata: Metadata = { title: 'Contact' };

export default function Contact() {
  return (
    <PageShell>
      <h1>Contact</h1>
      <ContactLinks email={profile.email} links={profile.links} />
    </PageShell>
  );
}
