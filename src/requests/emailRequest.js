const Joi = require('joi');

// Definisikan skema validasi untuk email
const emailSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': 'Nama harus berupa teks.',
            'string.empty': 'Nama tidak boleh kosong.',
            'string.min': 'Nama harus memiliki minimal {#limit} karakter.',
            'string.max': 'Nama harus memiliki maksimal {#limit} karakter.',
            'any.required': 'Nama wajib diisi.'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'Email harus berupa teks.',
            'string.empty': 'Email tidak boleh kosong.',
            'string.email': 'Email tidak valid.',
            'any.required': 'Email wajib diisi.'
        }),
});

// Fungsi untuk memvalidasi email
const validateEmail = (req, res, next) => {
    const { error } = emailSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateEmail,
};
