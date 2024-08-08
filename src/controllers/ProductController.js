const Product = require('../models/Product');
const XLSX = require('xlsx');
// Mengambil semua produk

exports.importProducts = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Read the Excel file
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON
    const products = XLSX.utils.sheet_to_json(sheet);

    // Save each product to the database
    for (const product of products) {
      await Product.createProduct(product);
    }

    res.status(201).json({ message: 'Products imported successfully', count: products.length });
  } catch (error) {
    res.status(500).json({ message: 'Error importing products', error: error.message });
  }
};
exports.exportProducts = async (req, res) => {
  try {
    // Fetch products from the database
    const products = await Product.getAllProducts(); // Ensure you have this method in your model

    // Create a new workbook and a worksheet
    const workbook =  XLSX.utils.book_new();
    const worksheet =  XLSX.utils.json_to_sheet(products);

    // Append the worksheet to the workbook
     XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    // Set the filename
    const filename = 'products.xlsx';

    // Write the workbook to a file
     XLSX.writeFile(workbook, filename);

    // Send the file as a response
    res.download(filename, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error exporting products');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error exporting products', error: error.message });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.status(200).json({ status: 'success', data: products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching products', error: error.message });
  }
};

// Mengambil produk berdasarkan ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.getProductById(id);
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    res.status(error.message === 'Product not found' ? 404 : 500).json({ status: 'error', message: 'Error fetching product', error: error.message });
  }
};

// Membuat produk baru
exports.createProduct = async (req, res) => {
  const { name, category_id, price } = req.body;
  try {
    const newProductId = await Product.createProduct({ name, category_id, price });
    res.status(201).json({ status: 'success', message: 'Product created successfully', data: { id: newProductId } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error creating product', error: error.message });
  }
};

// Memperbarui produk
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category_id, price } = req.body;
  try {
    await Product.updateProduct(id, { name, category_id, price });
    res.status(200).json({ status: 'success', message: 'Product updated successfully' });
  } catch (error) {
    res.status(error.message === 'Product not found' ? 404 : 500).json({ status: 'error', message: 'Error updating product', error: error.message });
  }
};

// Menghapus produk
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.deleteProduct(id);
    res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    res.status(error.message === 'Product not found' ? 404 : 500).json({ status: 'error', message: 'Error deleting product', error: error.message });
  }
};
