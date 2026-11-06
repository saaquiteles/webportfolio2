import { PageShell } from '@/components/global/PageShell';
import { ContactLinks } from '@/components/sections/ContactLinks';
import { profile } from '@/data/profile';

export default function Contact() {
  return (
    <PageShell>
      <h1>Contact</h1>
      <ContactLinks email={profile.email} links={profile.links} />
    </PageShell>
  );
}
