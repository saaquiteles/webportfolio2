import type { Education } from '@/lib/types';
import { DateRange } from './DateRange';

interface EducationListProps {
  entries: Education[];
}

// Each degree is an h3 because the page supplies the h2 "Education" above this list.
export function EducationList({ entries }: EducationListProps) {
  return (
    <ul>
      {entries.map((entry) => (
        <li key={`${entry.school}-${entry.start}`}>
          <h3>{entry.degree}</h3>
          <p>{entry.school}</p>
          <DateRange start={entry.start} end={entry.end} />
        </li>
      ))}
    </ul>
  );
}
