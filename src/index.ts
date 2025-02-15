// TODO
import { requestEvents } from "./api";
import { groupEvents } from "./grouping";
import { excludeEvents } from "./grouping/excluding";
import { datesIntoRanges } from "./api/dates";
import { groupByGenerated } from "./grouping/byGeneratedGroup";

const startDate = new Date(2025, 1, 12);
const endDate = new Date(2025, 1, 26);
const dateRanges = datesIntoRanges(startDate, endDate);

for (const { start, end } of dateRanges) {
  const apiEvents = await requestEvents(start, end, "6162");

  const excludedSubjects: string[] = process.env.SUBGROUPS?.split(",") ?? [""];
  const filteredEvents = excludeEvents(apiEvents, "title", excludedSubjects);

  const subgroups: string[] = process.env.SUBGROUPS?.split(",") ?? [""];
  const groupedEvents = groupEvents(filteredEvents, "subgroup", subgroups);

  for (const subgroup of subgroups) {
    const byId = groupByGenerated(
      groupedEvents.get(subgroup) ?? [],
      (event) => event.id
    );
  }
}
