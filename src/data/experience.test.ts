import { describe, expect, it } from 'vitest';
import { education, experience, highlights } from './experience';

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

describe('experience data', () => {
  it('stores every date as a valid YYYY-MM string', () => {
    const dates = [
      ...experience.flatMap(({ start, end }) => [start, end]),
      ...education.flatMap(({ start, end }) => [start, end]),
      ...highlights.map(({ date }) => date),
    ].filter((date) => date !== undefined);

    for (const date of dates) expect(date).toMatch(YEAR_MONTH);
  });
});
