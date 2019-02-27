import * as Knex from "knex";

exports.up = async function(knex: Knex): Promise<any> {
  await knex.schema.alterTable("EventLog", table => {
    table.jsonb("effect");
    table.index(["payload", "effect"], "eventLogIndex", "GIN");
  });
};

exports.down = async function(knex: Knex): Promise<any> {
  await knex.raw('drop index "eventLogIndex";');
  await knex.schema.alterTable("EventLog", table => {
    table.dropColumn("effect");
  });
};
