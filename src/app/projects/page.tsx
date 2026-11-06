import { PageShell } from '@/components/global/PageShell';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { projects } from '@/data/projects';

export default function Projects() {
  return (
    <PageShell>
      <h1>Projects</h1>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </PageShell>
  );
}
