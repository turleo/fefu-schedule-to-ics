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
import { parseArgs } from "util";
import { exit } from "node:process";

const rawConfig = await Bun.file("./config.toml").text();
const config = TOML.parse(rawConfig) as Config;

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    username: {
      type: "string",
    },
    password: {
      type: "string",
    },
    help: {
      type: "boolean",
    },
  },
  strict: true,
  allowPositionals: true,
});

if (values["help"]) {
  console.log(
    "FEFU to ICS stealer \n\
\n\
Usage: run [...args] \n\
\n\
  --username [username] - univer.dvfu.ru password \n\
  --password [password] - univer.dvfu.ru password\
\n\
if no arguments specified, refresh token from config.toml will be used \n"
  );
  exit();
}

const requestForWeeks = config.requestForWeeks;
const startDate = new Date();
const endDate = new Date(startDate.getTime() + requestForWeeks * 7 * MS_IN_DAY);

const dateRanges = datesIntoRanges(startDate, endDate);

const calendarManager = await CalendarManager(
  config.calendarAuth,
  config.calendarsByGroups
);
const apiManager = ApiManager(config);

if (values["username"]) {
  let password = values["password"];
  if (!password) {
    console.log("Specify password:");
    for await (const line of console) {
      password = line;
      if (password) {
        break;
      }
    }
  }

  await apiManager.createAccessToken(values["username"], password!);
  console.log("✅ Credentials fetched");
  config.accessToken = apiManager.config.accessToken;
  config.refreshToken = apiManager.config.refreshToken;
  const file = await Bun.file("./config.toml");
  await file.write(TOML.stringify(config));
  console.log("💾 Credentials saved");
}

for (const { start, end } of dateRanges) {
  console.log(
    `🔽 Fetching for dates ${start.toDateString()} to ${end.toDateString()}`
  );

  const apiEvents = await apiManager.requestEvents(start, end, config.groupIds);
  console.log(`🔽 Fetched ${apiEvents.length} events`);

  const filteredEvents = excludeEvents(
    apiEvents,
    "discipline",
    config.excludedSubjects,
    (a) => a.name
  );

  const subgroups: string[] = Object.keys(config.calendarsByGroups);
  const groupedEvents = groupEvents(
    filteredEvents,
    "academicSubgroup",
    subgroups,
    (a) => a?.name ?? ""
  );

  for (const subgroup of subgroups) {
    if (!config.calendarsByGroups[subgroup]) {
      console.log(`⏭️ Skipping subgroup ${subgroup}`);
      continue;
    }
    const events = groupedEvents.get(subgroup);
    const ics = massApiEventToIcs(events ?? []);

    console.log(`💾 Writing subgroup ${subgroup} to calendar`);
    await calendarManager.uploadIcs(subgroup, start, ics);
    console.log(`💾 Written`);
  }
}
