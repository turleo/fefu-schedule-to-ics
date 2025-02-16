import type { ApiEvent } from "@/api/types";
import { createEvents, type DateTime, type EventAttributes } from "ics";

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
    location: event.distanceEducationURL
      ? event.distanceEducationURL
      : event.classroom,
    uid: event.guid,
  };
  return attributes;
}

export function massApiEventToIcsEvent(apiEvents: ApiEvent[]) {
  const icsEvents: EventAttributes[] = [];
  for (const apiEvent of apiEvents) {
    icsEvents.push(apiEventToIcs(apiEvent));
  }
  return icsEvents;
}

export function massApiEventToIcs(apiEvent: ApiEvent[]) {
  const out = createEvents(massApiEventToIcsEvent(apiEvent));
  if (out.error || !out.value) {
    throw out.error ?? new Error("could not generate ics");
  }
  return out.value;
}
