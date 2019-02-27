import * as DateFns from "date-fns";
import {
  addMonths,
  getYear,
  isBefore,
  isWithinRange,
  lastDayOfMonth,
  startOfMonth,
} from "date-fns";
import { Brand } from "helpers";
import { groupBy, includes } from "lodash-es";

export type Type = Brand<string, "ISO8601Date">;
export type DateTense = "today" | "past" | "future";
export const VALID_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

export function _assertValid(date: Type): Type {
  if (process.env.NODE_ENV !== "production" && !VALID_REGEX.test(date)) {
    throw new Error(`Invalid IsoDate ${date}`);
  }
  return date;
}

export function toIsoDate(date: Date | string): Type {
  return DateFns.format(date, "YYYY-MM-DD") as Type;
}

export function toShortDayDate(date: Type): string {
  return DateFns.format(_assertValid(date), "ddd M-D-YYYY");
}

export function toLongDay(date: Type): string {
  return DateFns.format(_assertValid(date), "dddd");
}

export function toShortMonthAndDate(date: Type): string {
  return DateFns.format(_assertValid(date), "MMM D");
}

export function formatLongForm(date: Type): string {
  return DateFns.format(_assertValid(date), "ddd, MMMM D, YYYY");
}

export function getMonthAndYearFromIsoDate(date: Type): string {
  return DateFns.format(date, "YYYY-MM");
}

export function formatLongDayMonthYear(date: Date | string): string {
  return DateFns.format(date, "dddd, MMMM D, YYYY");
}

export function areEqual(today: Type, date: Type): boolean {
  return _assertValid(today) == _assertValid(date);
}

export function isTomorrow(today: Type, date: Type): boolean {
  _assertValid(date);
  _assertValid(today);
  const tomorrow = DateFns.addDays(today, 1);
  return DateFns.isSameDay(tomorrow, date);
}

/**
 * Sunday is 0, Saturday is 6
 */
export function getWeekDayFromIsoDate(date: Type): number {
  return DateFns.getDay(date);
}

export function getMonthDayFromIsoDate(date: Type): number {
  return DateFns.getDate(date);
}

export function getMonthAndDayFromIsoDate(date: Type): string {
  return DateFns.format(date, "MMM D");
}

export function getYearFromIsoDate(date: Type): number {
  return parseInt(date.slice(0, 4), 10);
}

function getCalendarWeekNumberFromDate(
  date: Type,
  firstDayOfMonth: Type,
  sundayBeforeFirstDayOfMonth: Type
): number {
  if (DateFns.isSameMonth(date, firstDayOfMonth)) {
    return Math.floor(
      DateFns.differenceInDays(date, sundayBeforeFirstDayOfMonth) / 7
    );
  } else if (DateFns.isAfter(date, firstDayOfMonth)) {
    return DateFns.differenceInCalendarWeeks(date, firstDayOfMonth);
  }
  return 0;
}

export function getDateTense(date: Type, currentDate: Type): DateTense {
  if (date == currentDate) {
    return "today";
  } else if (date.localeCompare(currentDate) > 0) {
    return "future";
  }
  return "past";
}

interface DateObj {
  date: Type;
}

export function dateIso(
  literals: TemplateStringsArray,
  ...placeholders: never[]
) {
  if (literals.length != 1) {
    throw new Error("One parameter only, please.");
  }
  const date = literals[0];
  if (!VALID_REGEX.test(date)) {
    throw new Error(`Invalid IsoDate ${date}`);
  }
  return date as Type;
}
