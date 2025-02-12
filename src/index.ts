// TODO
import { createEvents } from "ics";
import { requestEvents } from "./api";
import { massApiEventToIcs } from "./ics";
import { groupEventsBySubgroups } from "./grouping";

const startDate = new Date(2025, 1, 12);
const endDate = new Date(2025, 1, 26);
const apiEvents = await requestEvents(startDate, endDate, 6162);

const subgroups: string[] = process.env.SUBGROUPS?.split(",") ?? [""];
const groupedEvents = groupEventsBySubgroups(apiEvents, subgroups);
for (const subgroup of subgroups) {
  const icsEvents = massApiEventToIcs(groupedEvents[subgroup]);
  const file = createEvents(icsEvents);
  if (file.value) {
    Bun.write(`${subgroup || "out"}.ics`, file.value);
  } else {
    console.error(file.error);
  }
}
