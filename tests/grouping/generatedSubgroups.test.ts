import { test, expect } from "bun:test";
import apiEvents from "../apiEvents.json";
import { groupByGenerated } from "@/grouping/byGeneratedGroup";

test("group events by subgroups", () => {
  const grouped = groupByGenerated(apiEvents, (event) => event.academicSubgroup?.name ?? "");
  expect(grouped.keys().toArray()).toEqual(["1", "2", ""]);
});
