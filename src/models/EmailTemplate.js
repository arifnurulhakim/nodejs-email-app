const knex = require('knex')(require('../../knexfile'));

const dbPrefix = process.env.DB_PREFIX || '';
const tableName = `${dbPrefix}email_templates`;

// Mengambil semua template email
exports.getAllTemplates = async () => {
  try {
    const templates = await knex(tableName);
    return templates;
  } catch (error) {
    throw new Error(`Error fetching templates: ${error.message}`);
  }
};

// Mengambil template email berdasarkan ID
exports.getTemplateById = async (id) => {
  try {
    const template = await knex(tableName).where({ id }).first();
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  } catch (error) {
    throw new Error(`Error fetching template: ${error.message}`);
  }
};

// Membuat template email baru
exports.createTemplate = async (data) => {
  try {
    const [newTemplateId] = await knex(tableName).insert(data);
    return newTemplateId; // Return the ID of the created template
  } catch (error) {
    throw new Error(`Error creating template: ${error.message}`);
  }
};

// Memperbarui template email
exports.updateTemplate = async (id, data) => {
  try {
    const template = await knex(tableName).where({ id }).first();
    if (!template) {
      throw new Error('Template not found');
    }
    await knex(tableName).where({ id }).update(data);
    return true; // Return true if updated successfully
  } catch (error) {
    throw new Error(`Error updating template: ${error.message}`);
  }
};

// Menghapus template email
exports.deleteTemplate = async (id) => {
  try {
    const template = await knex(tableName).where({ id }).first();
    if (!template) {
      throw new Error('Template not found');
    }
    await knex(tableName).where({ id }).del();
    return true; // Return true if deleted successfully
  } catch (error) {
    throw new Error(`Error deleting template: ${error.message}`);
  }
};
