exports.up = function (knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('description').notNullable();
    table.string('status').notNullable().defaultTo('incomplete');
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tasks');
};
