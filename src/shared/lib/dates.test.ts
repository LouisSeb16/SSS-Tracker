import { formatDay, formatTime, localDayRange, startOfLocalDay } from '@/shared/lib/dates';

// Built from local-time components so the tests hold in any timezone.
const at = (y: number, m: number, d: number, h = 0, min = 0, s = 0, ms = 0) =>
  new Date(y, m, d, h, min, s, ms).getTime();

describe('startOfLocalDay', () => {
  it('returns local midnight for any time in the day', () => {
    expect(startOfLocalDay(at(2026, 5, 14, 15, 30))).toBe(at(2026, 5, 14));
    expect(startOfLocalDay(at(2026, 5, 14, 23, 59, 59, 999))).toBe(at(2026, 5, 14));
    expect(startOfLocalDay(at(2026, 5, 14))).toBe(at(2026, 5, 14));
  });
});

describe('localDayRange', () => {
  it('is half-open: includes midnight, excludes next midnight', () => {
    const { start, end } = localDayRange(at(2026, 5, 14, 12));
    expect(start).toBe(at(2026, 5, 14));
    expect(end).toBe(at(2026, 5, 15));
  });

  it('puts the last millisecond of a day inside it and the next midnight outside', () => {
    const { start, end } = localDayRange(at(2026, 5, 14));
    const lastMs = at(2026, 5, 14, 23, 59, 59, 999);
    expect(lastMs >= start && lastMs < end).toBe(true);
    const nextMidnight = at(2026, 5, 15);
    expect(nextMidnight >= start && nextMidnight < end).toBe(false);
  });

  it('crosses month and year boundaries', () => {
    expect(localDayRange(at(2026, 11, 31, 10)).end).toBe(at(2027, 0, 1));
    expect(localDayRange(at(2026, 0, 31, 10)).end).toBe(at(2026, 1, 1));
  });

  it('handles days that are not 24 hours long (DST) without drifting', () => {
    // Spring forward and fall back in the US and Europe fall inside these windows.
    for (const [m, d] of [
      [2, 8],
      [2, 29],
      [9, 25],
      [10, 1],
    ]) {
      const { start, end } = localDayRange(at(2026, m, d, 12));
      expect(start).toBe(at(2026, m, d));
      expect(end).toBe(at(2026, m, d + 1));
    }
  });
});

describe('formatters', () => {
  it('formats a day', () => {
    expect(formatDay(at(2026, 5, 14, 9))).toBe('Sun, 14 Jun 2026');
  });

  it('formats a time', () => {
    expect(formatTime(at(2026, 5, 14, 15, 5))).toBe('3:05 PM');
  });
});
