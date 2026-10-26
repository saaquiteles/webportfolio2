import { ProjectCard } from '@/components/sections/ProjectCard';
import { projects } from '@/data/projects';

export default function Projects() {
  return (
    <main className="p-8">
      <h1>Projects</h1>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </main>
  );
}
