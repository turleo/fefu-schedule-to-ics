import type { CalendarManagerClass } from "./types";

export async function uploadIcs(
  this: CalendarManagerClass,
  subgroup: string,
  startDate: Date,
  ics: string
) {
  if (!this.calendars[subgroup]) {
    return;
  }
  await this.client.createCalendarObject({
    calendar: this.calendars[subgroup],
    filename: `${startDate.toISOString()}@${subgroup}.ics`,
    iCalString: ics,
  });
}
