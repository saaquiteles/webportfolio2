import { ContactLinks } from '@/components/sections/ContactLinks';
import { profile } from '@/data/profile';

export default function Contact() {
  return (
    <main className="p-8">
      <h1>Contact</h1>
      <ContactLinks email={profile.email} links={profile.links} />
    </main>
  );
}
