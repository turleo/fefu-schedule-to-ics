import { createDAVClient } from "tsdav";
import type { CreatedDAVClient } from "./types";

export async function fetchAndGroupCalendars(
  client: CreatedDAVClient,
  calendarUrls: Record<string, string>
) {
  const calendars = (await client.fetchCalendars())
    .map((calendar) => {
      for (const subgroup in calendarUrls) {
        if (calendarUrls[subgroup] == calendar.url.toLowerCase()) {
          return [subgroup, calendar];
        }
      }
    })
    .filter((calendar) => !!calendar);

  return Object.fromEntries(calendars);
}
