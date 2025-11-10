import { test, expect } from "bun:test";
import { groupEvents } from "@/grouping";
import apiEvents from "../apiEvents.json";

test("group events by subgroups", () => {
  const subgroups = ["1", "2", "default"];
  const grouped = groupEvents(
    apiEvents,
    "academicSubgroup",
    subgroups,
    (a) => a?.name ?? ""
  );
  expect(grouped.get("1")?.length).toBe(1);
  expect(grouped.get("2")?.length).toBe(1);
  expect(grouped.get("default")?.length).toBe(1);
});
