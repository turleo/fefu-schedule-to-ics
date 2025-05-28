import { test, expect } from "bun:test";
import apiEvents from "../apiEvents.json";
import { excludeEvents } from "@/grouping/excluding";

test("excluding events with empty values", () => {
  const excluded = excludeEvents(apiEvents, "ppsLoad", ["Лекция"], (a) => a?.name ?? "");
  expect(excluded.length).toBe(0);
});

test("excluding events without empty values", () => {
  const excluded = excludeEvents(apiEvents, "discipline", ["Предмет ещё полезнее"], (a) => a.name);
  expect(excluded.length).toBe(2);
});
