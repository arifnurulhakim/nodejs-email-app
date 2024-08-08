const Category = require('../models/Category');

// Mengambil semua kategori
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.status(200).json({ status: 'success', data: categories });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching categories', error: error.message });
  }
};

// Mengambil kategori berdasarkan ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.getCategoryById(id);
    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    res.status(error.message === 'Category not found' ? 404 : 500).json({ status: 'error', message: 'Error fetching category', error: error.message });
  }
};

// Membuat kategori baru
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategoryId = await Category.createCategory({ name });
    res.status(201).json({ status: 'success', message: 'Category created successfully', data: { id: newCategoryId } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error creating category', error: error.message });
  }
};

// Memperbarui kategori
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await Category.updateCategory(id, { name });
    res.status(200).json({ status: 'success', message: 'Category updated successfully' });
  } catch (error) {
    res.status(error.message === 'Category not found' ? 404 : 500).json({ status: 'error', message: 'Error updating category', error: error.message });
  }
};

// Menghapus kategori
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await Category.deleteCategory(id);
    res.status(200).json({ status: 'success', message: 'Category deleted successfully' });
  } catch (error) {
    res.status(error.message === 'Category not found' ? 404 : 500).json({ status: 'error', message: 'Error deleting category', error: error.message });
  }
};
