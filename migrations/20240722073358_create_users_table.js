// migrations/xxxx_create_users_table.js
const dbPrefix = process.env.DB_PREFIX || '';

exports.up = function(knex) {
  return knex.schema.createTable(`${dbPrefix}users`, function(table) {
    table.increments('id').primary();
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(`${dbPrefix}users`);
};
