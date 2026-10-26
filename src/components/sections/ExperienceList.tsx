import { formatMonth } from '@/lib/dates';
import type { Experience } from '@/lib/types';

interface ExperienceListProps {
  entries: Experience[];
}

export function ExperienceList({ entries }: ExperienceListProps) {
  return (
    <ul>
      {entries.map((entry) => (
        <li key={`${entry.org}-${entry.start}`}>
          <h3>{entry.role}</h3>
          <p>{entry.org}</p>
          <p>
            <time dateTime={entry.start}>{formatMonth(entry.start)}</time>
            {' – '}
            {entry.end ? <time dateTime={entry.end}>{formatMonth(entry.end)}</time> : 'Present'}
          </p>
          <p>{entry.summary}</p>
        </li>
      ))}
    </ul>
  );
}
