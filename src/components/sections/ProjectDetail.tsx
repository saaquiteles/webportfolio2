import Link from 'next/link';
import type { Project } from '@/lib/types';

interface ProjectDetailProps {
  project: Project;
  titleId: string;
}

export function ProjectDetail({ project, titleId }: ProjectDetailProps) {
  const { slug, title, summary, year, tags, links } = project;

  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-sm text-muted">{year}</p>
      <h2 id={titleId} className="text-2xl break-words">
        {title}
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
      <Link href={`/projects/${slug}/`} className="rounded-sm font-bold">
        Read the full case study
      </Link>
    </div>
  );
}
