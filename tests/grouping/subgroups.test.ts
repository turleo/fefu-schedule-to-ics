import { test, expect } from "bun:test";
import { groupEventsBySubgroups } from "@/grouping";
import apiEvents from "../apiEvents.json";

test("group events by subgroups", () => {
  const subgroups = ["1", "2"];
  const grouped = groupEventsBySubgroups(apiEvents, subgroups);
  expect(grouped["1"].length).toBe(2);
  expect(grouped["2"].length).toBe(1);
});
