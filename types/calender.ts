export type TCalendarView = "day" | "week" | "month" | "year" | "agenda";
export type TEventColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "orange"
  | "gray";
export type TBadgeVariant = "dot" | "colored" | "mixed";
export type TWorkingHours = { [key: number]: { from: number; to: number } };
export type TVisibleHours = { from: number; to: number };

export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
}

export interface IEvent {
  id: string | number;
  startDate: string;
  endDate: string;
  title: string;
  color: TEventColor;
  description: string;
  user: string[];
  isTask?: boolean;
  // Fields present when event comes from the API (populated)
  startTime?: { hour: number; minute: number };
  endTime?: { hour: number; minute: number };
  users?: { _id: string; name: string; email?: string }[];
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
