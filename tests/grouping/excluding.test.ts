import { test, expect } from "bun:test";
import apiEvents from "../apiEvents.json";
import { excludeEvents } from "@/grouping/excluding";

test("excluding events with empty values", () => {
  const excluded = excludeEvents(apiEvents, "pps_load", ["Лекция"]);
  expect(excluded.length).toBe(0);
});

test("excluding events without empty values", () => {
  const excluded = excludeEvents(apiEvents, "title", ["Предмет ещё полезнее"]);
  expect(excluded.length).toBe(1);
});
