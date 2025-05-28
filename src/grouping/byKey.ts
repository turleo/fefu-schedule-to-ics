export function groupEvents<T, K extends keyof T>(
  events: T[],
  key: K,
  values: string[],
  hash: (a: T[K]) => string
) {
  const groups: Map<String, T[]> = new Map();

  for (const key of values) {
    groups.set(key, []);
  }

  for (const event of events) {
    const localKey = hash(event[key]);
    if (localKey && values.includes(localKey)) {
      groups.get(localKey)?.push(event);
    } else {
      console.log(localKey, values);
      for (const subgroup of values) {
        groups.get(subgroup)?.push(event);
      }
    }
  }

  return groups;
}
