import type { ApiEvent } from "@/api/types";

export function groupEventsBySubgroups(events: ApiEvent[], subgroups: string[]) {
  const bySubgroups: Record<string, ApiEvent[]> = {};

  for (const subgroup of subgroups) {
    bySubgroups[subgroup] = [];
  }

  for (const event of events) {
    if (!!event.subgroup) {
      bySubgroups[event.subgroup].push(event);
    } else {
      for (const subgroup of subgroups) {
        bySubgroups[subgroup].push(event);
      }
    }
  }

  return bySubgroups;
}
