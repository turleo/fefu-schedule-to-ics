// TODO
import { requestEvents } from "./api";
import { groupEvents } from "./grouping";
import { excludeEvents } from "./grouping/excluding";
import { datesIntoRanges } from "./api/dates";
import { CalendarManager } from "./exports/caldav";
import { massApiEventToIcs } from "./exports/ics";

const startDate = new Date(2025, 1, 12);
const endDate = new Date(2025, 2, 26);

const dateRanges = datesIntoRanges(startDate, endDate);

const calendarUrls: Record<string, string> = JSON.parse(
  process.env.CALENDARS_BY_SUBGROUPS ?? "{}"
);
const calendarAuth: any = JSON.parse(process.env.CALDAV_AUTH ?? "{}");
const calendarManager = await CalendarManager(calendarAuth, calendarUrls);

const timeout =
  parseInt(process.env.TIMEOUT_BEFORE_NEXT_REQUEST ?? "10000") ?? 10000;
let errors = 0;

for (const { start, end } of dateRanges) {
  console.log(
    `Fetching for dates ${start.toDateString()} to ${end.toDateString()}`
  );
  let apiEvents = undefined;
  while (!apiEvents) {
    try {
      apiEvents = await requestEvents(start, end, process.env.GROUP_ID);
    } catch (e) {
      errors += 1;
      console.error(e);
      console.log(`Waiting ${timeout * errors}...`);
      await Bun.sleep(timeout * errors);
    }
  }
  console.log(`Got ${apiEvents.length} events`);

  const excludedSubjects: string[] = process.env.SUBGROUPS?.split(",") ?? [""];
  const filteredEvents = excludeEvents(apiEvents, "title", excludedSubjects);

  const subgroups: string[] = process.env.SUBGROUPS?.split(",") ?? [""];
  const groupedEvents = groupEvents(filteredEvents, "subgroup", subgroups);

  for (const subgroup of subgroups) {
    if (!calendarUrls[subgroup]) {
      console.log(`Skipping subgroup ${subgroup}`);
      continue;
    }
    const events = groupedEvents.get(subgroup);
    const ics = massApiEventToIcs(events ?? []);

    console.log(`Writing subgroup ${subgroup} to calendar`);
    await calendarManager.uploadIcs(subgroup, start, ics);
    console.log(`Written`);
  }

  console.log(`Waiting ${timeout}...`);
  await Bun.sleep(timeout);
}
