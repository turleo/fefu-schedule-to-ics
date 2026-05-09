import type { ApiEvent } from "@/api/types";
import { createEvents, type DateTime, type EventAttributes } from "ics";

function apiEventToIcs(event: ApiEvent) {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
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

  const group = `${event.academicGroup?.name}${event.academicSubgroup ? " (" + event.academicSubgroup.name + ")" : ""}`;
  const teacher = `${event.teacher?.fullName}${event.teacher?.academicDegree ? " (" + event.teacher.academicDegree.name + ")" : ""}`;
  const type = `${event.ppsLoad?.name || event.academicControl?.name}`;

  const attributes: EventAttributes = {
    start,
    startInputType: "utc",
    duration,
    title: event.discipline.name,
    description: `${group}, ${type}\n${teacher}`,
    location: event.distance_education_url
      ? event.distance_education_url
      : event.facility?.name,
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
