import * as Knex from "knex";
import { addForeignKeyColumn } from "../helpers";

exports.up = async function(knex: Knex): Promise<any> {
  await knex.schema.createTable("User", table => {
    table.increments("id");
    table.string("firstName");
    table.string("lastName");
  });
};

exports.down = async function(knex: Knex): Promise<any> {
  await knex.schema.dropTable("User");
};
