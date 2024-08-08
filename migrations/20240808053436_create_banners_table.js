const dbPrefix = process.env.DB_PREFIX || '';

exports.up = function(knex) {
  return knex.schema.createTable(`${dbPrefix}banners`, function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('img_url').notNullable(); // Kolom untuk menyimpan URL gambar
    table.timestamps(true, true); // Menyimpan created_at dan updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(`${dbPrefix}banners`);
};
