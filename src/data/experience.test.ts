import { describe, expect, it } from 'vitest';
import { experience } from './experience';

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

describe('experience data', () => {
  it('stores every date as a valid YYYY-MM string', () => {
    for (const entry of experience) {
      expect(entry.start).toMatch(YEAR_MONTH);
      if (entry.end !== undefined) expect(entry.end).toMatch(YEAR_MONTH);
    }
  });
});
