const Joi = require('joi');

// Definisikan skema validasi untuk kategori
const categorySchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': 'Nama kategori harus berupa teks.',
            'string.empty': 'Nama kategori tidak boleh kosong.',
            'string.min': 'Nama kategori harus memiliki minimal {#limit} karakter.',
            'string.max': 'Nama kategori harus memiliki maksimal {#limit} karakter.',
            'any.required': 'Nama kategori wajib diisi.'
        }),
    description: Joi.string()
        .optional()
        .max(200)
        .messages({
            'string.base': 'Deskripsi kategori harus berupa teks.',
            'string.max': 'Deskripsi kategori harus memiliki maksimal {#limit} karakter.'
        }),
});

// Fungsi untuk memvalidasi kategori
const validateCategory = (req, res, next) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateCategory,
};
