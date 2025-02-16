import { createDAVClient } from "tsdav";
import { fetchAndGroupCalendars } from "./calendars";
import { uploadIcs } from "./upload";
import type { CalendarManagerClass } from "./types";

export async function CalendarManager(
  auth: any,
  calendarUrls: Record<string, string>
): Promise<CalendarManagerClass> {
  /**
   * class to communicate with caldav
   * @param auth argument to https://github.com/natelindev/tsdav/blob/master/src/client.ts#L54
   */

  // @ts-ignore
  const client = await createDAVClient(auth);

  const calendars = await fetchAndGroupCalendars(client, calendarUrls);

  return {
    client,
    calendars,
    uploadIcs,
  };
}
