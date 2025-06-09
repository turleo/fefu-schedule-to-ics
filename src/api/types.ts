import type Config from "@/config/types";

export interface DataRange {
  start: Date;
  end: Date;
}

export interface ApiEvent {
  guid: string;
  discipline: {
    name: string;
  };
  start_time: string;
  end_time: string;
  academicGroup: {
    name: string;
  } | null;
  facility: {
    name: string;
  } | null;
  teacher: {
    fullName: string;
    academicDegree: string | null;
  };
  academicControl: {
    name: string;
  } | null;
  ppsLoad: {
    name: string;
  } | null;
  academicSubgroup: {
    name: string;
  } | null;
  distance_education_url: string | null;
}

export interface ApiManager {
  config: Config;
  createAccessToken: (
    this: ApiManager,
    username: string,
    password: string
  ) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  requestEvents: (
    this: ApiManager,
    start: Date,
    end: Date,
    groups: number[]
  ) => Promise<ApiEvent[]>;
}
