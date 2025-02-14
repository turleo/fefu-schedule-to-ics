import { MS_IN_DAY } from "../consts";
import type { DataRange } from "../types";

export function datesIntoRanges(start: Date, end: Date) {
  const dates: DataRange[] = [];
  start.setHours(0, 0, 0, 0);

  const rangeStartDaysOffset = start.getDay() - 1; // Days past monday
  let rangeStart = new Date(start.getTime() - rangeStartDaysOffset * MS_IN_DAY);
  let rangeEnd = new Date(rangeStart.getTime() + 6 * MS_IN_DAY);
  dates.push({
    start: rangeStart,
    end: rangeEnd,
  });

  while (end > rangeEnd) {
    rangeStart = new Date(rangeStart.getTime() + 7 * MS_IN_DAY);
    rangeEnd = new Date(rangeEnd.getTime() + 7 * MS_IN_DAY);
    dates.push({
      start: rangeStart,
      end: rangeEnd,
    });
  }

  return dates;
}
