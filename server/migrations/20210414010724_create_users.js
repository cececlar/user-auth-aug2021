exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone').notNullable();
    table.string('address').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
