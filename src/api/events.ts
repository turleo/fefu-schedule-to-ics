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
  const r = await fetch(`https://univer.dvfu.ru/schedule/get?${options}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:135.0) Gecko/20100101 Firefox/135.0",
    },
  });
  if (r.status !== 200) {
    console.log(`https://univer.dvfu.ru/schedule/get?${options}`);
    throw new Error(await r.text());
  }

  const rawAnswer = await r.text();
  try {
    const answer = JSON.parse(rawAnswer) as Partial<ApiAnswer>;
    if (answer.code == 400) {
      throw new Error();
    }
    const events = answer.events ?? [];

    return events;
  } catch {
    console.log(`https://univer.dvfu.ru/schedule/get?${options}`);
    throw new Error(rawAnswer);
  }
}
