const dbPrefix = process.env.DB_PREFIX || '';

exports.up = function(knex) {
  return knex.schema.createTable(`${dbPrefix}sending_emails`, function(table) {
    table.increments('id').primary();
    table.string('email_template_id').notNullable(); // ID template email yang digunakan
    table.string('recipient_email').notNullable(); // Email penerima
    table.json('data').notNullable(); // Data khusus untuk penggantian template
    table.boolean('is_sent').defaultTo(false); // Status pengiriman
    table.timestamps(true, true); // Menyimpan created_at dan updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(`${dbPrefix}sending_emails`);
};
