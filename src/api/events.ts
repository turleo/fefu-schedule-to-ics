import type { ApiAnswer, ApiEvent } from "@/api/types";

export async function requestEvents(
  start: Date,
  end: Date,
  groups?: string,
  ppsId?: string,
  facilityId?: string
) {
  if (!process.env.REQUEST_EVENTS) {
    const answer = Bun.file(`${import.meta.dir}/mocking/events.json`);
    return (await answer.json()) as ApiEvent[];
  }
  const options = new URLSearchParams({
    type: "agendaWeek",
    start: start.toISOString(),
    end: end.toISOString(),
    ["groups[]"]: groups ?? "0",
    ppsId: ppsId ?? "",
    facilityId: facilityId ?? "0",
  });
  const r = await fetch(`https://univer.dvfu.ru/schedule/get?${options}`);
  console.log(`https://univer.dvfu.ru/schedule/get?${options}`);
  const answer = (await r.json()) as ApiAnswer;
  const events = answer.events;

  return events;
}
