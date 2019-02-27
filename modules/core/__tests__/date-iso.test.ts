import * as DateIso from "core/date-iso";
import { dateIso } from "core/date-iso";

describe("toIsoDate", () => {
  it("should format date in ISO8601 date format (YYYY-MM-DD)", () => {
    const date = new Date(2018, 11, 15, 6, 5);
    const isoDate = DateIso.toIsoDate(date);
    expect(isoDate).toEqual(dateIso`2018-12-15`);
  });
});

describe("getWeekDayFromIsoDate", () => {
  it("should get the week day given an iso date", () => {
    const isoDate = dateIso`2018-12-15`;
    expect(DateIso.getWeekDayFromIsoDate(isoDate)).toBe(6);
  });
});

describe("getMonthDayFromIsoDate", () => {
  it("should get the month day given an iso date", () => {
    const isoDate = dateIso`2018-12-15`;
    expect(DateIso.getMonthDayFromIsoDate(isoDate)).toBe(15);
  });
});

describe("toLongDay", () => {
  it("should format to just the day of the week", () => {
    const shortDate = DateIso.toLongDay(
      DateIso.toIsoDate(new Date(2018, 0, 1))
    );
    expect(shortDate).toEqual("Monday");
  });
});

describe("toShortMonthAndDate", () => {
  it("should format to the month and dat", () => {
    const shortDate = DateIso.toShortMonthAndDate(
      DateIso.toIsoDate(new Date(2018, 0, 1))
    );
    expect(shortDate).toEqual("Jan 1");
  });
});

describe("toShortDayDate", () => {
  it("should format single digit date with no zeros", () => {
    const shortDate = DateIso.toShortDayDate(
      DateIso.toIsoDate(new Date(2018, 0, 1))
    );
    expect(shortDate).toEqual("Mon 1-1-2018");
  });
  it("should format double digit date", () => {
    const shortDate = DateIso.toShortDayDate(
      DateIso.toIsoDate(new Date(2018, 11, 12))
    );
    expect(shortDate).toEqual("Wed 12-12-2018");
  });
});

describe("formatLongForm", () => {
  it("should format an ISO date", () => {
    expect(DateIso.formatLongForm(dateIso`2019-01-17`)).toEqual(
      "Thu, January 17, 2019"
    );
  });
});

describe("getDateTense", () => {
  it("if date is before the current date should return past", () => {
    const date = dateIso`2018-11-15`;
    const currentDate = dateIso`2018-12-15`;
    expect(DateIso.getDateTense(date, currentDate)).toBe("past");
  });
  it("if date is after the current date should return future", () => {
    const date = dateIso`2018-13-15`;
    const currentDate = dateIso`2018-12-15`;
    expect(DateIso.getDateTense(date, currentDate)).toBe("future");
  });
  it("if date is the same as the current date should return today", () => {
    const date = dateIso`2018-12-15`;
    const currentDate = dateIso`2018-12-15`;
    expect(DateIso.getDateTense(date, currentDate)).toBe("today");
  });
});

describe("areEqual", () => {
  it("compares future/past/same times against today", async () => {
    const yesterday = dateIso`2019-01-10`;
    const today = dateIso`2019-01-11`;
    const altToday = "1-11-2019";
    const tomorrow = dateIso`2019-01-12`;
    const aYearAgo = dateIso`2018-01-11`;

    expect(() => DateIso.areEqual(today, altToday as any)).toThrow();
    expect(DateIso.areEqual(today, tomorrow)).toBe(false);
    expect(DateIso.areEqual(today, yesterday)).toBe(false);
    expect(DateIso.areEqual(today, aYearAgo)).toBe(false);
  });
});

describe("isTomorrow", () => {
  it("compares dates against tomorrow", async () => {
    const today = dateIso`2019-01-11`;
    const tomorrow = dateIso`2019-01-12`;
    const altTomorrow = "01/12/2019";
    const aYearAgoTomorrow = dateIso`2018-01-12`;

    expect(() => DateIso.isTomorrow(today, altTomorrow as any)).toThrow();
    expect(DateIso.isTomorrow(today, tomorrow)).toBe(true);
    expect(DateIso.isTomorrow(today, today)).toBe(false);
    expect(DateIso.isTomorrow(today, aYearAgoTomorrow)).toBe(false);
  });
});
