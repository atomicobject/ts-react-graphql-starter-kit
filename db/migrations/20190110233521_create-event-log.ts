import * as Knex from "knex";

exports.up = async function(knex: Knex): Promise<any> {
  await knex.schema.createTable("EventLog", table => {
    table
      .timestamp("timestamp")
      .defaultTo(knex.raw("NOW()"))
      .notNullable();
    table.specificType("index", "bigserial").notNullable();
    table.text("type").notNullable();
    table.jsonb("payload").notNullable();
    table.primary(["timestamp", "index"]);
  });
};

exports.down = async function(knex: Knex): Promise<any> {
  await knex.schema.dropTable("EventLog");
};
