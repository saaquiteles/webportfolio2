import { formatMonth } from '@/lib/dates';
import type { Education } from '@/lib/types';

interface EducationListProps {
  entries: Education[];
}

export function EducationList({ entries }: EducationListProps) {
  return (
    <ul>
      {entries.map((entry) => (
        <li key={`${entry.school}-${entry.start}`}>
          <h3>{entry.degree}</h3>
          <p>{entry.school}</p>
          <p>
            <time dateTime={entry.start}>{formatMonth(entry.start)}</time>
            {' – '}
            {entry.end ? <time dateTime={entry.end}>{formatMonth(entry.end)}</time> : 'Present'}
          </p>
        </li>
      ))}
    </ul>
  );
}
