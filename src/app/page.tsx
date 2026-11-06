import { PageShell } from '@/components/global/PageShell';
import { ContactLinks } from '@/components/sections/ContactLinks';
import { SketchArrow } from '@/components/sections/SketchArrow';
import { profile } from '@/data/profile';

export default function Home() {
  return (
    <PageShell>
      <section>
        <p className="mb-7 inline-block -rotate-2 rounded-md border-2 border-ink bg-surface px-4 py-2 font-semibold shadow-md">
          {profile.name}
        </p>
        <h1 className="max-w-5xl text-hero font-extrabold tracking-tight md:text-7xl lg:text-display">{profile.headline}</h1>
        <SketchArrow className="ml-auto h-14 w-28 text-tomato md:ml-72 md:h-24 md:w-56" />
        <p className="max-w-3xl text-lg text-pretty md:text-xl">{profile.tagline}</p>
        <ContactLinks email={profile.email} links={profile.links} />
      </section>
    </PageShell>
  );
}
