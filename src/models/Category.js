const knex = require('knex')(require('../../knexfile'));

const dbPrefix = process.env.DB_PREFIX || '';
const tableName = `${dbPrefix}categories`;

// Mengambil semua kategori
exports.getAllCategories = async () => {
  try {
    const categories = await knex(tableName);
    return categories;
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};

// Mengambil kategori berdasarkan ID
exports.getCategoryById = async (id) => {
  try {
    const category = await knex(tableName).where({ id }).first();
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};

// Membuat kategori baru
exports.createCategory = async (data) => {
  try {
    const [newCategoryId] = await knex(tableName).insert(data);
    return newCategoryId; // Return the ID of the created category
  } catch (error) {
    throw new Error(`Error creating category: ${error.message}`);
  }
};

// Memperbarui kategori
exports.updateCategory = async (id, data) => {
  try {
    const category = await knex(tableName).where({ id }).first();
    if (!category) {
      throw new Error('Category not found');
    }
    await knex(tableName).where({ id }).update(data);
    return true; // Return true if updated successfully
  } catch (error) {
    throw new Error(`Error updating category: ${error.message}`);
  }
};

// Menghapus kategori
exports.deleteCategory = async (id) => {
  try {
    const category = await knex(tableName).where({ id }).first();
    if (!category) {
      throw new Error('Category not found');
    }
    await knex(tableName).where({ id }).del();
    return true; // Return true if deleted successfully
  } catch (error) {
    throw new Error(`Error deleting category: ${error.message}`);
  }
};
