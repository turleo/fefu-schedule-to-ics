import { test, expect } from "bun:test";
import { groupEvents } from "@/grouping";
import apiEvents from "../apiEvents.json";

test("excluding events by subgroups", () => {
  const subgroups = ["1", "2", ""];
  const grouped = groupEvents(apiEvents, "subgroup", subgroups);
  expect(grouped.get("1")?.length).toBe(2);
  expect(grouped.get("2")?.length).toBe(1);
  expect(grouped.get("")?.length).toBe(1);
});
