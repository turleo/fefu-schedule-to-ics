import { test, expect } from "bun:test";
import { massApiEventToIcs } from "@/ics/converter";
import type { EventAttributes } from "ics";

const apiEvents = [
  {
    id: 1,
    guid: "61aa638a-c20e-4051-9a1f-e44f0014c05d",
    team_guid: "de73092d-cdb4-47e1-aeba-76743fa1f368",
    title: "Безумно полезный предмет",
    start: "2025-02-17T08:30:00+10:00",
    end: "2025-02-17T10:00:00+10:00",
    academicGroupId: 2,
    academicGroupGuid: "f4b026c3-3175-44a0-949d-4a71effc7d18",
    classroom: "D123",
    control_type: "Экзамен",
    disciplineId: 2,
    distanceEducationDescription: "",
    distanceEducationURL: "https://github.com/turleo/fefu-schedule-to-ics",
    group: "Б9123-09.03.03пикд",
    group_id: 6162,
    order: 4,
    pps_load: "",
    specialization: "Прикладная информатика в компьютерном дизайне",
    specialization_id: 64,
    students_number: 108,
    subgroup: "1",
    subgroup_id: null,
    teacher: "Самый лучший преподователь",
    teacher_degree: "Прям очень лучший преподователь",
    userId: 0,
  },
  {
    id: 1,
    guid: "61aa638a-c20e-4051-9a1f-e44f0014c05d",
    team_guid: "de73092d-cdb4-47e1-aeba-76743fa1f368",
    title: "Безумно полезный предмет",
    start: "2025-02-17T08:30:00+10:00",
    end: "2025-02-17T10:00:00+10:00",
    academicGroupId: 2,
    academicGroupGuid: "f4b026c3-3175-44a0-949d-4a71effc7d18",
    classroom: "D123",
    control_type: "",
    disciplineId: 2,
    distanceEducationDescription: "",
    distanceEducationURL: null,
    group: "Б9123-09.03.03пикд",
    group_id: 6162,
    order: 4,
    pps_load: "Лекция",
    specialization: "Прикладная информатика в компьютерном дизайне",
    specialization_id: 64,
    students_number: 108,
    subgroup: "",
    subgroup_id: null,
    teacher: "Самый лучший преподователь",
    teacher_degree: "",
    userId: 0,
  },
];

const expectedEvents: EventAttributes[] = [
  {
    start: [2025, 2, 16, 22, 30],
    startInputType: "utc",
    duration: { hours: 1, minutes: 30 },
    title: "Безумно полезный предмет",
    description:
      "Б9123-09.03.03пикд (1), Экзамен\nСамый лучший преподователь (Прям очень лучший преподователь)",
    location: "D123",
    url: "https://github.com/turleo/fefu-schedule-to-ics",
    uid: "1",
  },
  {
    start: [2025, 2, 16, 22, 30],
    startInputType: "utc",
    duration: { hours: 1, minutes: 30 },
    title: "Безумно полезный предмет",
    description: "Б9123-09.03.03пикд, Лекция\nСамый лучший преподователь",
    location: "D123",
    uid: "1",
  },
];

test("convert API output to ICS input", () => {
  const icsEvents = massApiEventToIcs(apiEvents);

  expect(icsEvents.length).toBe(2);
  expect(icsEvents[0]).toEqual(expectedEvents[0]);
  expect(icsEvents[1]).toEqual(expectedEvents[1]);
});

test("convert API output to ICS input in Vladivostok timezone", () => {
  process.env.TZ = "Asia/Vladivostok";
  const icsEvents = massApiEventToIcs(apiEvents);

  expect(icsEvents.length).toBe(2);
  expect(icsEvents[0]).toEqual(expectedEvents[0]);
  expect(icsEvents[1]).toEqual(expectedEvents[1]);
});
