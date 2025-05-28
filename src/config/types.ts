import type { createDAVClient } from "tsdav";

export default interface Config extends Record<string, any> {
  groupIds: number[];
  excludedSubjects: string[];
  calendarsByGroups: Record<string, string>;
  calendarAuth: Parameters<typeof createDAVClient>[0];
  requestForWeeks: number;

  refreshToken: string;
  accessToken: string;
  appAccess: string;
}
