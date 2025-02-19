// TODO
import { ApiManager } from "./api";
import { datesIntoRanges } from "./dates";
import { MS_IN_DAY } from "./api/consts";

import TOML from "smol-toml";
import type Config from "./config/types";

const rawConfig = await Bun.file("./config.toml").text();
const config = TOML.parse(rawConfig) as Config;

const requestForWeeks = config.requestForWeeks;
const startDate = new Date();
const endDate = new Date(startDate.getTime() + requestForWeeks * 7 * MS_IN_DAY);

const dateRanges = datesIntoRanges(startDate, endDate);

// const calendarManager = await CalendarManager(config.calendarAuth, config.calendarsByGroups);
const apiManager = ApiManager(config);

for (const { start, end } of dateRanges) {
  console.log(
    `🔽 Fetching for dates ${start.toDateString()} to ${end.toDateString()}`
  );

  const response = await apiManager.requestEvents(start, end, config.groupIds);
  console.log(response);

  // while (!apiEvents) {
  //   try {
  //     apiEvents = await requestEvents(start, end, process.env.GROUP_ID);
  //   } catch (e) {
  //     errors += 1;
  //     console.error("❌", e);
  //     console.log(`⏰ Waiting ${timeout * errors}...`);
  //     await Bun.sleep(timeout * errors);
  //   }
  // }

  // const filteredEvents = excludeEvents(apiEvents, "title", config.excludedSubjects);

  // const subgroups: string[] = Object.keys(config.calendarsByGroups);
  // const groupedEvents = groupEvents(filteredEvents, "subgroup", subgroups);

  // for (const subgroup of subgroups) {
  //   if (!config.calendarsByGroups[subgroup]) {
  //     console.log(`⏭️ Skipping subgroup ${subgroup}`);
  //     continue;
  //   }
  //   const events = groupedEvents.get(subgroup);
  //   const ics = massApiEventToIcs(events ?? []);

  //   console.log(`💾 Writing subgroup ${subgroup} to calendar`);
  //   await calendarManager.uploadIcs(subgroup, start, ics);
  //   console.log(`💾 Written`);
  // }
}
