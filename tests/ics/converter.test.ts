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
      "Самая лучшая группа (1), Экзамен\nСамый лучший преподователь (Прям очень лучший преподователь)",
    location: "https://github.com/turleo/fefu-schedule-to-ics",
    uid: "F81E2C10-B18F-4680-BEED-6F721F09D486",
  },
  {
    start: [2025, 2, 16, 22, 30],
    startInputType: "utc",
    duration: { hours: 1, minutes: 30 },
    title: "Безумно полезный предмет",
    description:
      "Самая лучшая группа (2), Экзамен\nСамый лучший преподователь (Прям очень лучший преподователь)",
    location: "https://github.com/turleo/fefu-schedule-to-ics",
    uid: "B79E9BF8-F14D-45AB-98FA-5F5731C3E090",
  },
  {
    start: [2025, 2, 16, 22, 30],
    startInputType: "utc",
    duration: { hours: 1, minutes: 30 },
    title: "Предмет ещё полезнее",
    description: "Самая лучшая группа, Лекция\nСамый лучший преподователь",
    location: "D123",
    uid: "33A1B51F-44A3-4186-BF9D-216F33554AB6",
  },
];

test("convert API output to ICS input", () => {
  const icsEvents = massApiEventToIcsEvent(apiEvents);

  expect(icsEvents.length).toBe(3);
  expect(icsEvents[0]).toEqual(expectedEvents[0]);
  expect(icsEvents[1]).toEqual(expectedEvents[1]);
  expect(icsEvents[2]).toEqual(expectedEvents[2]);
});

test("convert API output to ICS input in Vladivostok timezone", () => {
  process.env.TZ = "Asia/Vladivostok";
  const icsEvents = massApiEventToIcsEvent(apiEvents);

  expect(icsEvents.length).toBe(3);
  expect(icsEvents[0]).toEqual(expectedEvents[0]);
  expect(icsEvents[1]).toEqual(expectedEvents[1]);
  expect(icsEvents[2]).toEqual(expectedEvents[2]);
});
