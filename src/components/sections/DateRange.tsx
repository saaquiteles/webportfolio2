import { formatMonth } from '@/lib/dates';

interface DateRangeProps {
  start: string;
  end?: string;
}

export function DateRange({ start, end }: DateRangeProps) {
  return (
    <p className="font-mono text-sm text-muted">
      <time dateTime={start}>{formatMonth(start)}</time>
      {' – '}
      {end ? <time dateTime={end}>{formatMonth(end)}</time> : 'Present'}
    </p>
  );
}
