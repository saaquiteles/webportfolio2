import { PageShell } from '@/components/global/PageShell';
import { ProjectGrid } from '@/components/sections/ProjectGrid';
import { projects } from '@/data/projects';

export default function Projects() {
  return (
    <PageShell>
      <h1>Projects</h1>
      <ProjectGrid projects={projects} />
    </PageShell>
  );
}
