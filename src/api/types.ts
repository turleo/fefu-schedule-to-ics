import type Config from "@/config/types";

export interface DataRange {
  start: Date;
  end: Date;
}

export interface ApiEvent {
  id: number;
  guid: string;
  title: string;
  start: string;
  end: string;
  classroom: string;
  control_type: string;
  distanceEducationURL: any;
  group: string;
  pps_load: string;
  subgroup: string;
  teacher: string;
  teacher_degree: string;
}

export interface ApiManager {
  config: Config;
  refreshAccessToken: () => Promise<void>;
  requestEvents: (
    this: ApiManager,
    start: Date,
    end: Date,
    groups: number[]
  ) => Promise<void>;
}
