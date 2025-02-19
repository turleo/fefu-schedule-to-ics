export default interface Config extends Record<string, any> {
  groupIds: number[];
  excludedSubjects: string[];
  calendarsByGroups: Record<string, string>;
  calendarAuth: any;
  requestForWeeks: number;

  refreshToken: string;
  accessToken: string;
  appAccess: string;
}
