// migrations/xxxx_create_users_table.js
const dbPrefix = process.env.DB_PREFIX || '';

exports.up = function(knex) {
  return knex.schema.createTable(`${dbPrefix}users`, function(table) {
    table.increments('id').primary();
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.tinyint('otp').nullable(); // Add OTP as tinyint, nullable
    table.datetime('otp_expires').nullable(); // Add otp_expires as datetime, nullable
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(`${dbPrefix}users`);
};
