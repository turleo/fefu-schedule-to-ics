import type { ApiAnswer, ApiEvent } from "@/api/types";
import { MS_IN_DAY } from "./consts";
import type { DataRange } from "./types";

async function requestEventsApi(
  start: Date,
  end: Date,
  groups: string,
  ppsId: string,
  facilityId: string
) {
  const options = new URLSearchParams({
    type: "agendaWeek",
    start: start.toISOString(),
    end: end.toISOString(),
    ["groups[]"]: groups,
    ppsId: ppsId,
    facilityId: facilityId,
  });
  const r = await fetch(`https://univer.dvfu.ru/schedule/get?${options}`);
  console.log(`https://univer.dvfu.ru/schedule/get?${options}`);
  const answer = (await r.json()) as ApiAnswer;
  const events = answer.events;

  return events;
}

export function datesIntoRanges(start: Date, end: Date) {
  const dates: DataRange[] = [];
  start.setHours(0, 0, 0, 0);

  const rangeStartDaysOffset = start.getDay() - 1; // Days past monday
  let rangeStart = new Date(start.getTime() - rangeStartDaysOffset * MS_IN_DAY);
  let rangeEnd = new Date(rangeStart.getTime() + 6 * MS_IN_DAY);
  dates.push({
    start: rangeStart,
    end: rangeEnd,
  });

  while (end > rangeEnd) {
    rangeStart = new Date(rangeStart.getTime() + 7 * MS_IN_DAY);
    rangeEnd = new Date(rangeEnd.getTime() + 7 * MS_IN_DAY);
    dates.push({
      start: rangeStart,
      end: rangeEnd,
    });
  }

  return dates;
}

export async function requestEvents(
  start: Date,
  end: Date,
  groups?: number,
  ppsId?: string,
  facilityId?: string
) {
  /**
   * Gets range of dates and batches them to fit API request
   * (Into 6 days, monday to saturday)
   * and then merges requests back to big array
   */
  if (!process.env.REQUEST_EVENTS) {
    const answer = Bun.file(`${import.meta.dir}/mocking/events.json`);
    return (await answer.json()) as ApiEvent[];
  }

  const dates = datesIntoRanges(start, end);

  let events: ApiEvent[] = [];
  for ({ start, end } of dates) {
    const newEvents = await requestEventsApi(
      start,
      end,
      (groups ?? 0).toString(),
      ppsId ?? "",
      facilityId ?? "0"
    );
    events = [...events, ...newEvents];
  }

  return events;
}
