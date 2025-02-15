export function groupByGenerated<T, K>(objects: T[], predicate: (obj: T) => K) {
  const groups: Map<K, T[]> = new Map();

  for (const obj of objects) {
    const key = predicate(obj);
    groups.set(key, [...(groups.get(key) ?? []), obj]);
  }

  return groups;
}
