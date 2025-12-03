import { ApiManager } from "./api";
import { datesIntoRanges } from "./dates";
import { MS_IN_DAY } from "./api/consts";
import { type ApiEvent } from "./api/types";

import type Config from "./config/types";
import { excludeEvents } from "./grouping/excluding";
import { groupEvents } from "./grouping";
import { CalendarManager } from "./exports/caldav";
import { massApiEventToIcs } from "./exports/ics";
import { parseArgs } from "util";
import { exit } from "node:process";
import path from "node:path";
import TOML from "smol-toml";
import { styleText } from "node:util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    username: {
      type: "string",
    },
    password: {
      type: "string",
    },
    config: {
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
  console.info(
    `🗓 ${styleText(["white", "bold"], "FEFU to ICS stealer")} ${styleText(["gray", "italic"], `(${process.env.BUILD_INFO_PUBLIC_VERSION ?? "dev"})`)}\n\
\n\
Usage: ${styleText(["bold"], "run [...args]")} \n\
\n\
  ${styleText(["bold"], "--username <username>".padEnd(30, " "))}univer.dvfu.ru password \n\
  ${styleText(["bold"], "--password <password>".padEnd(30, " "))}univer.dvfu.ru password\n\
  ${styleText(["bold"], "--config <./config.toml>".padEnd(30, " "))}path to config\n\
\n\
if no arguments specified, refresh token from ./config.toml will be used \n`
  );
  exit();
}

async function main() {
  const configPath = path.resolve(
    process.cwd(),
    values.config ?? "config.toml"
  );
  const rawConfig = Bun.file(configPath);
  const config = TOML.parse(await rawConfig.text()) as Config;

  const apiManager = await ApiManager(config);

  if (values["username"]) {
    let password = values["password"];
    if (!password) {
      console.write("Specify password:");
      for await (const line of console) {
        password = line;
        if (password) {
          break;
        }
      }
    }

    await apiManager.createAccessToken(values["username"], password!);
    console.info("✅ Credentials fetched");
    config.accessToken = apiManager.config.accessToken;
    config.refreshToken = apiManager.config.refreshToken;
    config.username = values["username"];
    config.password = password!;
  }

  const requestForWeeks = config.requestForWeeks;
  const startDate = new Date();
  const endDate = new Date(
    startDate.getTime() + requestForWeeks * 7 * MS_IN_DAY
  );

  const dateRanges = datesIntoRanges(startDate, endDate);

  const calendarManager = await CalendarManager(
    config.calendarAuth,
    config.calendarsByGroups
  );

  for (const { start, end } of dateRanges) {
    console.debug(
      `🔽 Fetching for dates ${start.toDateString()} to ${end.toDateString()}`
    );

    let apiEvents: ApiEvent[] = [];
    apiEvents = await apiManager.requestEvents(start, end, config.groupIds);
    console.debug(`🔽 Fetched ${apiEvents.length} events`);

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
        console.debug(`⏭️ Skipping subgroup ${subgroup}`);
        continue;
      }
      const events = groupedEvents.get(subgroup);
      const ics = massApiEventToIcs(events ?? []);

      console.debug(`💾 Writing subgroup ${subgroup} to calendar`);
      await calendarManager.uploadIcs(subgroup, start, ics);
      console.debug(`💾 Written`);
    }
  }

  await rawConfig.write(TOML.stringify(config));
  console.info("💾 Credentials saved");
}

main();
