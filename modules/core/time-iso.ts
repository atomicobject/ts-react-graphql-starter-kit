import * as DateFns from "date-fns";
import { Flavor } from "helpers";

// todo: refactor and resolve these:
// (this file's type was meant to represent time-of-day, but in practice sometimes holds (new Date()).toString()s in it.)
export type Type = Flavor<string, "ISO8601Time">;
// export type Type = Flavor<string, "Time of day (HH:MM:SS)">;
export const VALID_REGEX = /^\d{2}:\d{2}:\d{2}$/;

export type TimeSet = {
  startTime: Type;
  endTime: Type;
};
export function isValid(t: any): t is Type {
  return VALID_REGEX.test(t);
}

export function getDuration(timeSet: TimeSet): number {
  return DateFns.differenceInMinutes(
    parse(timeSet.endTime),
    parse(timeSet.startTime)
  );
}
export type DurationMinutes = Flavor<number, "Duration in minutes">;

export function toHoursMinutes(input: Type): string {
  return DateFns.format(parse(input), "h:mma");
}

export function toHoursAmPm(input: Type): string {
  return DateFns.format(parse(input), "ha");
}
export function toHours(input: Type): string {
  return DateFns.format(parse(input), "h");
}
export function toMinutes(input: Type): string {
  return DateFns.format(parse(input), "mm");
}
export function parse(input: Type): Date {
  return DateFns.parse(`2000-01-01T${input}`);
}
export function from(
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0
): Type {
  return fromDate(new Date(2000, 1, 1, hours, minutes, seconds));
}

export function fromDate(date: Date): Type {
  return DateFns.format(date, "HH:mm:ss") as Type;
}

export function timeIso(
  literals: TemplateStringsArray,
  ...placeholders: never[]
) {
  if (literals.length != 1) {
    throw new Error("One parameter only, please.");
  }
  const time = literals[0];
  if (!VALID_REGEX.test(time)) {
    throw new Error(`Invalid IsoTime ${time}`);
  }
  return time as Type;
}
