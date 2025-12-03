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

export class AuthError extends Error {
  constructor(msg: string, options: ErrorOptions | undefined) {
    super(msg, options);
  }
}

export class RefreshTokenError extends AuthError {
  constructor(msg: string, options: ErrorOptions) {
    super(msg, options);
  }
}

export class FromCredentialsError extends AuthError {
  constructor(msg: string) {
    super(msg, undefined);
  }
}
