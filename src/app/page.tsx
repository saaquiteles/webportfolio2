import { PageShell } from '@/components/global/PageShell';
import { ProjectGrid } from '@/components/sections/ProjectGrid';
import { ContactLinks } from '@/components/sections/ContactLinks';
import { SketchArrow } from '@/components/sections/SketchArrow';
import { ScrollRuler } from '@/components/animations/ScrollRuler';
import { PointerDepthField, PointerDepthLayer } from '@/components/animations/PointerDepth';
import { KineticHeadline } from '@/components/animations/KineticHeadline';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';

export default function Home() {
  const featured = projects.filter((project) => project.featured);

  return (
    <PageShell>
      <ScrollRuler />
      <section>
        <PointerDepthField>
          <PointerDepthLayer strength={8} className="flex w-fit">
            <p className="mb-7 inline-block -rotate-2 rounded-md border-2 border-ink bg-surface px-4 py-2 font-semibold shadow-md">
              {profile.name}
            </p>
          </PointerDepthLayer>
          <PointerDepthLayer strength={4}>
            <h1 className="max-w-5xl text-hero font-extrabold tracking-tight md:text-7xl lg:text-display">
              <KineticHeadline text={profile.headline} />
            </h1>
          </PointerDepthLayer>
          <PointerDepthLayer strength={12}>
            <SketchArrow drawIn className="ml-auto h-14 w-28 text-tomato md:ml-72 md:h-24 md:w-56" />
          </PointerDepthLayer>
        </PointerDepthField>
        <p className="max-w-3xl text-lg text-pretty md:text-xl">{profile.tagline}</p>
        <ContactLinks email={profile.email} links={profile.links} emailOnly />
      </section>
      {featured.length > 0 && (
        <section aria-labelledby="featured-projects" className="mt-20">
          <h2 id="featured-projects">Projects</h2>
          <ProjectGrid projects={featured} />
        </section>
      )}
    </PageShell>
  );
}
