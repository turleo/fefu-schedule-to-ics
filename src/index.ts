// TODO
import { createEvents } from "ics";
import { requestEvents } from "./api";
import { massApiEventToIcs } from "./ics";

const startDate = new Date(2025, 1, 12);
const endDate = new Date(2025, 1, 26);
const apiEvents = await requestEvents(startDate, endDate, 6162);
const icsEvents = massApiEventToIcs(apiEvents);
console.log(icsEvents[0]);
const file = createEvents(icsEvents);
if (file.value) {
  Bun.write("test.ics", file.value);
} else {
  console.error(file.error);
}
