import { formatMonth } from '@/lib/dates';
import type { Highlight } from '@/lib/types';

interface HighlightListProps {
  items: Highlight[];
}

export function HighlightList({ items }: HighlightListProps) {
  return (
    <ul>
      {items.map((item) => (
        <li key={`${item.title}-${item.date}`}>
          <h3>{item.title}</h3>
          <p>{item.org}</p>
          <p>
            <time dateTime={item.date}>{formatMonth(item.date)}</time>
          </p>
          {item.summary && <p>{item.summary}</p>}
        </li>
      ))}
    </ul>
  );
}
