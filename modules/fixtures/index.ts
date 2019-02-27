import { Knex } from "db";
import * as defaultScenario from "fixtures/scenarios/default";

export async function seedScenarios(knex: Knex): Promise<null> {
  return await defaultScenario.seed(knex);
}
