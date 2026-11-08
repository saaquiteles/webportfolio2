import type { Project } from '@/lib/types';
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) return null;

  return (
    <ul className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <li key={project.slug} className={index % 2 === 0 ? 'rotate-1' : '-rotate-1'}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}
