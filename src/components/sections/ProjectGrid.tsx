import type { Project } from '@/lib/types';
import { NeighbourField } from '@/components/animations/NeighbourField';
import { PickupBoard, PickupButton } from '@/components/animations/PickupBoard';
import { TiltCard } from '@/components/animations/TiltCard';
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  pickup?: boolean;
}

export function ProjectGrid({ projects, pickup = false }: ProjectGridProps) {
  if (projects.length === 0) return null;

  const list = (
    <ul className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <li key={project.slug} className={index % 2 === 0 ? 'rotate-1' : '-rotate-1'}>
          <TiltCard>
            <ProjectCard
              project={project}
              action={pickup ? <PickupButton project={project} /> : undefined}
            />
          </TiltCard>
        </li>
      ))}
    </ul>
  );

  const field = <NeighbourField>{list}</NeighbourField>;
  return pickup ? <PickupBoard>{field}</PickupBoard> : field;
}
