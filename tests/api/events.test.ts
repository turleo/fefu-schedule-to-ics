import { test, describe, expect } from "bun:test";
import { datesIntoRanges } from "@/api/events";

test("generate data ranges", () => {
  const startDate = new Date(2025, 1, 12);
  const endDate = new Date(2025, 1, 26);

  const ranges = datesIntoRanges(startDate, endDate);
  expect(ranges.length).toBe(3);

  expect(ranges[0].start.toISOString()).toBe(
    new Date(2025, 1, 10, 0, 0, 0, 0).toISOString()
  );
  expect(ranges[0].end.toISOString()).toBe(
    new Date(2025, 1, 16, 0, 0, 0, 0).toISOString()
  );

  expect(ranges[1].start.toISOString()).toBe(
    new Date(2025, 1, 17, 0, 0, 0, 0).toISOString()
  );
  expect(ranges[1].end.toISOString()).toBe(
    new Date(2025, 1, 23, 0, 0, 0, 0).toISOString()
  );

  expect(ranges[2].start.toISOString()).toBe(
    new Date(2025, 1, 24, 0, 0, 0, 0).toISOString()
  );
  expect(ranges[2].end.toISOString()).toBe(
    new Date(2025, 2, 2, 0, 0, 0, 0).toISOString()
  );
});
