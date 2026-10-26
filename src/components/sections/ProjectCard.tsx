import Link from 'next/link';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
}

// The title is an h2 because the page supplies the h1 above its list of cards.
export function ProjectCard({ project }: ProjectCardProps) {
  const { slug, title, summary, tags, links } = project;

  return (
    <article>
      <h2>
        <Link href={`/projects/${slug}/`}>{title}</Link>
      </h2>
      <p>{summary}</p>
      <ul aria-label="Tags">
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      {links?.repo && (
        <a href={links.repo} aria-label={`${title} repository`}>
          Repository
        </a>
      )}
      {links?.paper && (
        <a href={links.paper} aria-label={`${title} paper`}>
          Paper
        </a>
      )}
    </article>
  );
}
