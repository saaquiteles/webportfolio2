import type { Experience } from '@/lib/types';
import { DateRange } from './DateRange';

interface ExperienceListProps {
  entries: Experience[];
}

// Each role is an h3 because the page supplies the h2 "Experience" above this list.
export function ExperienceList({ entries }: ExperienceListProps) {
  return (
    <ul>
      {entries.map((entry) => (
        <li key={`${entry.org}-${entry.start}`}>
          <h3>{entry.role}</h3>
          <p>{entry.org}</p>
          <DateRange start={entry.start} end={entry.end} />
          <p>{entry.summary}</p>
        </li>
      ))}
    </ul>
  );
}
