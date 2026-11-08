import { PageShell } from '@/components/global/PageShell';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { projects } from '@/data/projects';

export default function Projects() {
  return (
    <PageShell>
      <h1>Projects</h1>
      {projects.length > 0 && (
        <ul className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <li key={project.slug} className={index % 2 === 0 ? 'rotate-1' : '-rotate-1'}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
