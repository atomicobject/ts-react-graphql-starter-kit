import * as Knex from "knex";

exports.up = async function(knex: Knex) {
  await knex.schema.createTable("snacks", table => {
    table.increments("id");
    table
      .string("name")
      .notNullable()
      .unique();
  });

  await knex.schema.createTable("votes", table => {
    table.increments("id");
    table
      .integer("snackId")
      .notNullable()
      .index();
    table
      .foreign("snackId")
      .references("snacks.id")
      .onDelete("CASCADE");
    table
      .dateTime("createdAt")
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex: Knex) {
  await knex.schema.dropTable("votes");
  await knex.schema.dropTable("snacks");
};
