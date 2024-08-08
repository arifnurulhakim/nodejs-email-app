const dbPrefix = process.env.DB_PREFIX || '';

exports.up = function(knex) {
  return knex.schema.createTable(`${dbPrefix}email_templates`, function(table) {
    table.increments('id').primary();
    table.string('name').notNullable(); // Nama template email
    table.string('subject').notNullable(); // Subjek email
    table.text('body').notNullable(); // Isi email
    table.timestamps(true, true); // Menyimpan created_at dan updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(`${dbPrefix}email_templates`);
};
