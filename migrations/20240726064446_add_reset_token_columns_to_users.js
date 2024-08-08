/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const dbPrefix = process.env.DB_PREFIX || '';
exports.up = function(knex) {
    return knex.schema.table(`${dbPrefix}users`, function(table) {
      table.string('reset_token'); // Menambahkan kolom untuk token reset password
      table.timestamp('reset_token_expires'); // Menambahkan kolom untuk waktu kedaluwarsa token
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table(`${dbPrefix}users`, function(table) {
      table.dropColumn('reset_token'); // Menghapus kolom reset_token
      table.dropColumn('reset_token_expires'); // Menghapus kolom reset_token_expires
    });
  };
  