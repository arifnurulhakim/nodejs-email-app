const knex = require('knex')(require('../../knexfile'));

const dbPrefix = process.env.DB_PREFIX || '';
const tableName = `${dbPrefix}emails`;

// Mengambil semua email
exports.getAllEmails = async () => {
  try {
    const emails = await knex(tableName);
    return emails;
  } catch (error) {
    throw new Error(`Error fetching emails: ${error.message}`);
  }
};

// Mengambil email berdasarkan ID
exports.getEmailById = async (id) => {
  try {
    const email = await knex(tableName).where({ id }).first();
    if (!email) {
      throw new Error('Email not found');
    }
    return email;
  } catch (error) {
    throw new Error(`Error fetching email: ${error.message}`);
  }
};

// Membuat email baru
exports.createEmail = async (data) => {
  try {
    const [newEmailId] = await knex(tableName).insert(data);
    return newEmailId; // Return the ID of the created email
  } catch (error) {
    throw new Error(`Error creating email: ${error.message}`);
  }
};

// Memperbarui email
exports.updateEmail = async (id, data) => {
  try {
    const email = await knex(tableName).where({ id }).first();
    if (!email) {
      throw new Error('Email not found');
    }
    await knex(tableName).where({ id }).update(data);
    return true; // Return true if updated successfully
  } catch (error) {
    throw new Error(`Error updating email: ${error.message}`);
  }
};

// Menghapus email
exports.deleteEmail = async (id) => {
  try {
    const email = await knex(tableName).where({ id }).first();
    if (!email) {
      throw new Error('Email not found');
    }
    await knex(tableName).where({ id }).del();
    return true; // Return true if deleted successfully
  } catch (error) {
    throw new Error(`Error deleting email: ${error.message}`);
  }
};
