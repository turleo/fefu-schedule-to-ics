export function groupEvents<T, K extends keyof T>(
  events: T[],
  key: K,
  values: T[K][]
) {
  const groups: Map<T[K], T[]> = new Map();

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
