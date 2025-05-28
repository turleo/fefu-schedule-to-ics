import type { ApiEvent, ApiManager } from "@/api/types";
import util from "node:util";

export async function requestEvents(
  this: ApiManager,
  start: Date,
  end: Date,
  groupIds: number[]
): Promise<ApiEvent[]> {
  await this.refreshAccessToken();

  const rawRequest = await Bun.file(
    `${import.meta.dir}/static/request.graphql`
  ).text();
  const startDate = `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, "0")}-${start.getDate()}`;
  const endDate = `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, "0")}-${end.getDate()}`;
  const request = util.format(rawRequest, startDate, endDate, groupIds);

  const r = await fetch(`https://blackbox.dvfu.ru/v2/graphql/schedule`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${this.config.accessToken}`,
      "User-Agent": "Dart/3.4 (dart:io)",
      "content-type": "application/json",
      "Accept-Language": "ru-RU",
      Accept: "*/*",
      "Accept-Encoding": "gzip",
    },
    body: JSON.stringify({
      operationName: null,
      variables: {},
      query: request,
    }),
  });

  const rawAnswer = await r.text();
  try {
    const answer = JSON.parse(rawAnswer);
    const events = answer.data.lessons ?? [];

    return events;
  } catch {
    throw new Error(rawAnswer.slice(0, 100));
  }
}
