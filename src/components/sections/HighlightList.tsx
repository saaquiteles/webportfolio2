import { formatMonth } from '@/lib/dates';
import type { Highlight } from '@/lib/types';

interface HighlightListProps {
  highlights: Highlight[];
}

// Each highlight is an h3 because the page supplies the h2 "Also" above this list.
export function HighlightList({ highlights }: HighlightListProps) {
  return (
    <ul>
      {highlights.map((highlight) => (
        <li key={`${highlight.title}-${highlight.date}`}>
          <h3>{highlight.title}</h3>
          <p>{highlight.org}</p>
          <p>
            <time dateTime={highlight.date}>{formatMonth(highlight.date)}</time>
          </p>
          {highlight.summary && <p>{highlight.summary}</p>}
        </li>
      ))}
    </ul>
  );
}
