import { Flavor } from "helpers";

export type Percentage = Flavor<number, "percentage">;

export type HourlyRate = Flavor<number, "money per hour">;
export type DailyRate = Flavor<number, "money per day">;
