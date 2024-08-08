const dbPrefix = process.env.DB_PREFIX || '';

exports.up = function(knex) {
  return knex.schema.createTable(`${dbPrefix}sent_emails`, function(table) {
    table.increments('id').primary();
    table.string('sending_email_id').notNullable(); // ID dari tabel sending_emails
    table.string('recipient_email').notNullable(); // Email penerima
    table.timestamp('sent_at').notNullable(); // Waktu pengiriman
    table.text('response').nullable(); // Respon dari server email (jika ada)
    table.timestamps(true, true); // Menyimpan created_at dan updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(`${dbPrefix}sent_emails`);
};
