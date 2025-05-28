import type { ApiEvent } from "@/api/types";

export function excludeEvents<T extends keyof ApiEvent>(
  events: ApiEvent[],
  key: T,
  values: string[],
  hash: (b: ApiEvent[T]) => string
) {
  const newEvents: ApiEvent[] = [];

  for (const event of events) {
    if (event[key] && !values.includes(hash(event[key]))) {
      newEvents.push(event);
    }
  }
  return newEvents;
}
