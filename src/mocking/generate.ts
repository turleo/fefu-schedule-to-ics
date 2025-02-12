import { requestEvents } from "../api";
process.env.REQUEST_EVENTS = "true";

let start = new Date();
start.setHours(0, 0, 0, 0);
const startDay = start.getDay();
const startTargetDay = 1; // Monday
let startDayOffset = startTargetDay - startDay;
if (startDayOffset < 0) startDayOffset += 7;
start = new Date(start.getTime() + startDayOffset * 24 * 3600 * 1000);
console.log(start);

let end = start;
end = new Date(end.getTime() + 6 * 24 * 3600 * 1000);
console.log(end);

const events = await requestEvents(
  start,
  end,
  6482 // random group id
);

Bun.write(`${import.meta.dir}/events.json`, JSON.stringify(events));
