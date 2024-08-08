const knex = require('knex')(require('../../knexfile'));

const dbPrefix = process.env.DB_PREFIX || '';
const sentTableName = `${dbPrefix}sent_emails`;

// Mengambil semua email yang sudah terkirim
exports.getAll = async () => {
  try {
    const sentEmails = await knex(sentTableName);
    return sentEmails;
  } catch (error) {
    throw new Error(`Error fetching sent emails: ${error.message}`);
  }
};

// Mengambil email yang sudah terkirim berdasarkan ID
exports.getById = async (id) => {
  try {
    const sentEmail = await knex(sentTableName).where({ id }).first();
    if (!sentEmail) {
      throw new Error('Sent email not found');
    }
    return sentEmail;
  } catch (error) {
    throw new Error(`Error fetching sent email: ${error.message}`);
  }
};

// Membuat log email yang sudah terkirim
exports.create = async (data) => {
  try {
    const [newId] = await knex(sentTableName).insert(data);
    return newId; // Return the ID of the created sent email
  } catch (error) {
    throw new Error(`Error creating sent email: ${error.message}`);
  }
};

// Memperbarui log email yang sudah terkirim
exports.update = async (id, data) => {
  try {
    const sentEmail = await knex(sentTableName).where({ id }).first();
    if (!sentEmail) {
      throw new Error('Sent email not found');
    }
    await knex(sentTableName).where({ id }).update(data);
    return true; // Return true if updated successfully
  } catch (error) {
    throw new Error(`Error updating sent email: ${error.message}`);
  }
};

// Menghapus log email yang sudah terkirim
exports.delete = async (id) => {
  try {
    const sentEmail = await knex(sentTableName).where({ id }).first();
    if (!sentEmail) {
      throw new Error('Sent email not found');
    }
    await knex(sentTableName).where({ id }).del();
    return true; // Return true if deleted successfully
  } catch (error) {
    throw new Error(`Error deleting sent email: ${error.message}`);
  }
};
