
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.timestamps();
    table.string('name').notNullable();
    table.string('email').notNullable();
  })
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('users')
};
