import type { ApiEvent } from "@/api/types";

export function groupEvents<T extends keyof ApiEvent>(
  events: ApiEvent[],
  key: T,
  values: ApiEvent[T][]
) {
  const groups: Map<ApiEvent[T], ApiEvent[]> = new Map();

  for (const value of values) {
    groups.set(value, []);
  }

  for (const event of events) {
    if (event[key] && values.includes(event[key])) {
      groups.get(event[key])?.push(event);
    } else {
      for (const subgroup of values) {
        groups.get(subgroup)?.push(event);
      }
    }
  }

  return groups;
}
