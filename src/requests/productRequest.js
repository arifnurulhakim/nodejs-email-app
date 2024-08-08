const Joi = require('joi');

// Skema validasi untuk produk
const productSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': 'Product name must be a string',
    'string.empty': 'Product name is required',
    'string.min': 'Product name must be at least 3 characters long',
  }),
  category_id: Joi.number().integer().required().messages({
    'number.base': 'Category ID must be a number',
    'number.empty': 'Category ID is required',
  }),
  price: Joi.number().integer().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least 0',
    'number.empty': 'Price is required',
  }),
});

// Validator untuk membuat dan memperbarui produk
exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }
  next();
};
