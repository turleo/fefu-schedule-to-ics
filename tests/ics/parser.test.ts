import { getUIDAndDate } from "@/exports/ics/parser";
import { test, expect } from "bun:test";

const ical = await Bun.file('tests/event.ics').text()

test("get UID and date from .ics", () => {
  const out = getUIDAndDate(ical)
  expect(out).toEqual({
    uid: 12089328,
    date: new Date('2025-02-21T03:30:00Z')
  })
})