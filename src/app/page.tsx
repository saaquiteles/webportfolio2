import { PageShell } from '@/components/global/PageShell';
import { ContactLinks } from '@/components/sections/ContactLinks';
import { profile } from '@/data/profile';

export default function Home() {
  return (
    <PageShell>
      <p>{profile.name}</p>
      <h1>{profile.headline}</h1>
      <p>{profile.tagline}</p>
      <ContactLinks email={profile.email} links={profile.links} />
    </PageShell>
  );
}
