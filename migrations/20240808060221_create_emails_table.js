const dbPrefix = process.env.DB_PREFIX || '';

exports.up = function(knex) {
  return knex.schema.createTable(`${dbPrefix}emails`, function(table) {
    table.increments('id').primary();
    table.string('name').notNullable(); // Kolom untuk menyimpan nama
    table.string('email').notNullable(); // Kolom untuk menyimpan alamat email
    table.timestamps(true, true); // Menyimpan created_at dan updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(`${dbPrefix}emails`);
};
