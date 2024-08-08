// migrations/xxxx_create_products_table.js
const dbPrefix = process.env.DB_PREFIX || '';

exports.up = function(knex) {
  return knex.schema.createTable(`${dbPrefix}products`, function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('category_id').unsigned().references(`${dbPrefix}categories.id`).onDelete('CASCADE');
    table.decimal('price', 10, 2).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(`${dbPrefix}products`);
};
