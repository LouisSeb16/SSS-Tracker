import { addDays, format, startOfDay } from 'date-fns';

// Time is stored as epoch milliseconds in UTC. Convert to local time only for display
// and for day boundaries, and only through this file.

/** Epoch ms of local midnight at the start of the day containing `ms`. */
export function startOfLocalDay(ms: number): number {
  return startOfDay(ms).getTime();
}

/**
 * Half-open range [start, end) covering one local day. Query with
 * `createdAt >= start AND createdAt < end`. Half-open avoids a 23:59:59.999 off-by-one,
 * and addDays keeps local midnight correct on days with 23 or 25 hours (DST).
 */
export function localDayRange(ms: number): { start: number; end: number } {
  const start = startOfDay(ms);
  return { start: start.getTime(), end: addDays(start, 1).getTime() };
}

/** "Sun, 14 Jun 2026" */
export function formatDay(ms: number): string {
  return format(ms, 'EEE, d MMM yyyy');
}

/** "3:05 PM" */
export function formatTime(ms: number): string {
  return format(ms, 'h:mm a');
}
