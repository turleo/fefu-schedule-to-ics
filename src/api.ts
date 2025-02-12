import type { ApiAnswer } from "./types";

export async function requestEvents(
  strat: Date,
  end: Date,
  groups?: number,
  ppsId?: string,
  facilityId?: string
) {
  if (!process.env.REQUEST_EVENTS) {
    const answer = Bun.file("./mocking/events.json");
    return (await answer.json()) as ApiAnswer;
  }

  const options = new URLSearchParams({
    type: "agendaWeek",
    start: strat.toISOString(),
    end: end.toISOString(),
    ["groups[]"]: groups?.toString() ?? "",
    ppsId: ppsId ?? "",
    facilityId: facilityId ?? "0",
  });
  const r = await fetch(`https://univer.dvfu.ru/schedule/get?${options}`);
  const answer = (await r.json()) as ApiAnswer;
  const events = answer.events;

  return events;
}
