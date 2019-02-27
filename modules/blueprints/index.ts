import { declareBlueprint, Universe } from "atomic-object/blueprints";
import * as Blueprint from "atomic-object/blueprints/blueprint";
import * as DateIso from "core/date-iso";
import { padStart } from "lodash-es";
import { UnsavedUser } from "records/user";
import * as uuid from "uuid";

const padToTwoDigits = (n: number) => padStart(n.toString(), 2, "0");

let addDays = (d: Date, numDays: number) => {
  const dd = new Date(+d + numDays * 24 * 60 * 60 * 1000);
  return DateIso.toIsoDate(dd);
};

let plusMinus = (n: number) => Math.floor(Math.random() * (n * 2) - n);
let nextWeekPlusOrMinus = (n: number) => addDays(new Date(), 7 + plusMinus(n));

export const user = declareBlueprint({
  getRepo: ctx => ctx.repos.users,
  buildBlueprint: () =>
    Blueprint.design<UnsavedUser>({
      firstName: "Ned",
      lastName: "Flanders",
    }),
});

export { Universe };
