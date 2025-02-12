export interface ApiEvent {
  id: number;
  guid: string;
  team_guid: string;
  title: string;
  start: string;
  end: string;
  academicGroupId: number;
  academicGroupGuid: string;
  classroom: string;
  control_type: string;
  disciplineId: number;
  distanceEducationDescription: string;
  distanceEducationURL: any;
  group: string;
  group_id: number;
  order: number;
  pps_load: string;
  specialization: string;
  specialization_id: number;
  students_number: number;
  subgroup: string;
  subgroup_id: any;
  teacher: string;
  teacher_degree: string;
  userId: number;
}

export interface ApiAnswer {
  events: ApiEvent[];
  groups: string[];
  specializations: Record<string, string>;
  subgroups: Record<string, string>;
}
