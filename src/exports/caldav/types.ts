import type { ApiEvent } from "@/api/types";
import { createDAVClient, type DAVCalendar } from "tsdav";

export type CreatedDAVClient = Awaited<ReturnType<typeof createDAVClient>>;

export interface CalendarManagerClass {
  client: CreatedDAVClient;
  calendars: Record<string, DAVCalendar>;
  uploadIcs: (subgroup: string, startDate: Date, ics: string) => void;
}
