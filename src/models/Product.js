const knex = require('knex')(require('../../knexfile'));

const dbPrefix = process.env.DB_PREFIX || '';
const tableName = `${dbPrefix}products`;

// Mengambil semua produk
exports.getAllProducts = async (req, res) => {
  try {
    const products = await knex(tableName);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Mengambil produk berdasarkan ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await knex(tableName).where({ id }).first();
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Membuat produk baru
exports.createProduct = async (req, res) => {
  const { name, category_id } = req.body;
  try {
    await knex(tableName).insert({ name, category_id });
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Memperbarui produk
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category_id } = req.body;
  try {
    const product = await knex(tableName).where({ id }).first();
    if (product) {
      await knex(tableName).where({ id }).update({ name, category_id });
      res.status(200).json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Menghapus produk
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await knex(tableName).where({ id }).first();
    if (product) {
      await knex(tableName).where({ id }).del();
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
