// migrations/xxxx_create_categories_table.js
const dbPrefix = process.env.DB_PREFIX || '';

exports.up = function(knex) {
  return knex.schema.createTable(`${dbPrefix}categories`, function(table) {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(`${dbPrefix}categories`);
};
