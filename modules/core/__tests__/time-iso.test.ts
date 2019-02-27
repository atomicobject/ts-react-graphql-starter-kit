import * as TimeIso from "core/time-iso";

describe("isValid", () => {
  it("checks that a thing is an IsoTime", async () => {
    expect(TimeIso.isValid("22:15:00")).toBe(true);
    expect(TimeIso.isValid("22")).toBe(false);
    expect(TimeIso.isValid(null)).toBe(false);
    expect(TimeIso.isValid(undefined)).toBe(false);
  });
});
describe("toHoursMinutes", () => {
  it("converts from 24h to 12h time", async () => {
    expect(TimeIso.toHoursMinutes("07:45:00")).toEqual("7:45am");
    expect(TimeIso.toHoursMinutes("10:30:00")).toEqual("10:30am");
    expect(TimeIso.toHoursMinutes("13:00:00")).toEqual("1:00pm");
    expect(TimeIso.toHoursMinutes("22:15:00")).toEqual("10:15pm");
  });
});
describe("fromDate", () => {
  it("creates a time from a date", async () => {
    expect(TimeIso.fromDate(new Date(2000, 1, 1, 5, 15))).toEqual("05:15:00");
    expect(TimeIso.fromDate(new Date(2000, 1, 1, 15, 15))).toEqual("15:15:00");
  });
});
describe("from", () => {
  it("creates a time from a hours/minutes/seconds", async () => {
    expect(TimeIso.from(5, 15)).toEqual("05:15:00");
    expect(TimeIso.from(15)).toEqual("15:00:00");
    expect(TimeIso.from(5, 15, 34)).toEqual("05:15:34");
    // check that passing a string is okay because we are
    // not sure what the browser will give us
    expect(TimeIso.from("12" as any, 15, 34)).toEqual("12:15:34");
  });
});
describe("getDuration", () => {
  it("returns the difference between an end time and start time", () => {
    const times = {
      startTime: "07:00:00",
      endTime: "14:00:00",
    };
    expect(TimeIso.getDuration(times)).toEqual(420);
  });
});
