// TODO
import { ApiManager } from "./api";
import { datesIntoRanges } from "./dates";
import { MS_IN_DAY } from "./api/consts";

import TOML from "smol-toml";
import type Config from "./config/types";
import { excludeEvents } from "./grouping/excluding";
import { groupEvents } from "./grouping";
import { CalendarManager } from "./exports/caldav";
import { massApiEventToIcs } from "./exports/ics";

const rawConfig = await Bun.file("./config.toml").text();
const config = TOML.parse(rawConfig) as Config;

const requestForWeeks = config.requestForWeeks;
const startDate = new Date();
const endDate = new Date(startDate.getTime() + requestForWeeks * 7 * MS_IN_DAY);

const dateRanges = datesIntoRanges(startDate, endDate);

const calendarManager = await CalendarManager(config.calendarAuth, config.calendarsByGroups);
const apiManager = ApiManager(config);

for (const { start, end } of dateRanges) {
  console.log(
    `🔽 Fetching for dates ${start.toDateString()} to ${end.toDateString()}`
  );

  const apiEvents = await apiManager.requestEvents(start, end, config.groupIds);
  console.log(`🔽 Fetched ${apiEvents.length} events`)

  const filteredEvents = excludeEvents(apiEvents, "discipline", config.excludedSubjects, (a) => a.name);

  const subgroups: string[] = Object.keys(config.calendarsByGroups);
  const groupedEvents = groupEvents(filteredEvents, "academicSubgroup", subgroups, (a) => a?.name ?? "");

  for (const subgroup of subgroups) {
    if (!config.calendarsByGroups[subgroup]) {
      console.log(`⏭️ Skipping subgroup ${subgroup}`);
      continue;
    }
    const events = groupedEvents.get(subgroup);
    console.log(Object.keys(groupedEvents), subgroups)
    const ics = massApiEventToIcs(events ?? []);

    console.log(`💾 Writing subgroup ${subgroup} to calendar`);
    await calendarManager.uploadIcs(subgroup, start, ics);
    console.log(`💾 Written`);
  }
}
