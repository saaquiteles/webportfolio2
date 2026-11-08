import Link from 'next/link';
import type { Project } from '@/lib/types';
import { Tape } from './Tape';

interface ProjectCardProps {
  project: Project;
}

// The title is an h2 because the page supplies the h1 above its list of cards.
export function ProjectCard({ project }: ProjectCardProps) {
  const { slug, title, summary, year, tags, links } = project;

  return (
    <article className="relative flex h-full flex-col gap-4 border-2 border-rule bg-surface p-6">
      <Tape />
      <p className="font-mono text-sm text-muted">{year}</p>
      <h2 className="text-2xl break-words">
        <Link href={`/projects/${slug}/`} className="rounded-sm">
          {title}
        </Link>
      </h2>
      <p>{summary}</p>
      <ul aria-label="Tags" className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="border border-ink bg-surface px-2 py-1 font-mono text-sm text-ink"
          >
            {tag}
          </li>
        ))}
      </ul>
      {(links?.repo || links?.paper) && (
        <div className="flex flex-wrap gap-4">
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
        </div>
      )}
    </article>
  );
}
