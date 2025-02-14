import type { ApiEvent } from "@/api/types";

export function excludeEvents<T extends keyof ApiEvent>(
  events: ApiEvent[],
  key: T,
  values: ApiEvent[T][]
) {
  const newEvents: ApiEvent[] = [];

  for (const event of events) {
    if (event[key] && !values.includes(event[key])) {
      newEvents.push(event);
    }
  }
  return newEvents;
}
