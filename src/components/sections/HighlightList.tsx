import { formatMonth } from '@/lib/dates';
import type { Highlight } from '@/lib/types';

interface HighlightListProps {
  highlights: Highlight[];
}

// Each highlight is an h3 because the page supplies the h2 "Also" above this list.
export function HighlightList({ highlights }: HighlightListProps) {
  return (
    <ul className="flex flex-col gap-8">
      {highlights.map((highlight) => (
        <li
          key={`${highlight.title}-${highlight.date}`}
          className="flex flex-col gap-2 border-l-2 border-rule pl-4 break-words"
        >
          <h3>{highlight.title}</h3>
          <p>{highlight.org}</p>
          <p className="font-mono text-sm text-muted">
            <time dateTime={highlight.date}>{formatMonth(highlight.date)}</time>
          </p>
          {highlight.summary && <p>{highlight.summary}</p>}
        </li>
      ))}
    </ul>
  );
}
