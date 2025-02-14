import type { ApiEvent } from "@/api/types";
import { type DateTime, type EventAttributes } from "ics";

function apiEventToIcs(event: ApiEvent) {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const durationDate = new Date(endDate.getTime() - startDate.getTime());
  const duration = {
    hours: durationDate.getUTCHours(),
    minutes: durationDate.getUTCMinutes(),
  };
  const start = [
    startDate.getUTCFullYear(),
    startDate.getUTCMonth() + 1,
    startDate.getUTCDate(),
    startDate.getUTCHours(),
    startDate.getUTCMinutes(),
  ] as DateTime;

  const group = `${event.group}${event.subgroup ? " (" + event.subgroup + ")" : ""}`;
  const teacher = `${event.teacher}${event.teacher_degree ? " (" + event.teacher_degree + ")" : ""}`;
  const type = `${event.pps_load || event.control_type}`;

  const attributes: EventAttributes = {
    start,
    startInputType: "utc",
    duration,
    title: event.title,
    description: `${group}, ${type}\n${teacher}`,
    location: event.classroom,
    url: event.distanceEducationURL ?? undefined,
    uid: event.id.toString(),
  };
  return attributes;
}

export function massApiEventToIcs(apiEvents: ApiEvent[]) {
  const icsEvents: EventAttributes[] = [];
  for (const apiEvent of apiEvents) {
    icsEvents.push(apiEventToIcs(apiEvent));
  }
  return icsEvents;
}
