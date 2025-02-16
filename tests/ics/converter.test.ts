import { test, expect } from "bun:test";
import { massApiEventToIcsEvent } from "@/exports/ics/converter";
import type { EventAttributes } from "ics";
import apiEvents from "../apiEvents.json";

const expectedEvents: EventAttributes[] = [
  {
    start: [2025, 2, 16, 22, 30],
    startInputType: "utc",
    duration: { hours: 1, minutes: 30 },
    title: "Безумно полезный предмет",
    description:
      "Б9123-09.03.03пикд (1), Экзамен\nСамый лучший преподователь (Прям очень лучший преподователь)",
    location: "https://github.com/turleo/fefu-schedule-to-ics",
    uid: "61aa638a-c20e-4051-9a1f-e44f0014c05d",
  },
  {
    start: [2025, 2, 16, 22, 30],
    startInputType: "utc",
    duration: { hours: 1, minutes: 30 },
    title: "Предмет ещё полезнее",
    description: "Б9123-09.03.03пикд, Лекция\nСамый лучший преподователь",
    location: "D123",
    uid: "61aa638a-c20e-4051-9a1f-e44f0014c05d",
  },
];

test("convert API output to ICS input", () => {
  const icsEvents = massApiEventToIcsEvent(apiEvents);

  expect(icsEvents.length).toBe(2);
  expect(icsEvents[0]).toEqual(expectedEvents[0]);
  expect(icsEvents[1]).toEqual(expectedEvents[1]);
});

test("convert API output to ICS input in Vladivostok timezone", () => {
  process.env.TZ = "Asia/Vladivostok";
  const icsEvents = massApiEventToIcsEvent(apiEvents);

  expect(icsEvents.length).toBe(2);
  expect(icsEvents[0]).toEqual(expectedEvents[0]);
  expect(icsEvents[1]).toEqual(expectedEvents[1]);
});
