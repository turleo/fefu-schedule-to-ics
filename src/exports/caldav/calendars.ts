import type { CreatedDAVClient } from "./types";

export async function fetchAndGroupCalendars(
  client: CreatedDAVClient,
  calendarUrls: Record<string, string>
) {
  const calendars = await client.fetchCalendars();
  const out = [];
  for (const subgroup in calendarUrls) {
    for (const calendar of calendars) {
      if (calendarUrls[subgroup] == calendar.url.toLowerCase()) {
        out.push([subgroup, calendar]);
      }
    }
  }

  return Object.fromEntries(out);
}
