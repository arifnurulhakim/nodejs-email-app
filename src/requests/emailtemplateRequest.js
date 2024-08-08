const Joi = require('joi');

// Definisikan skema validasi untuk template email
const  emailtemplateSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': 'Nama template harus berupa teks.',
            'string.empty': 'Nama template tidak boleh kosong.',
            'string.min': 'Nama template harus memiliki minimal {#limit} karakter.',
            'string.max': 'Nama template harus memiliki maksimal {#limit} karakter.',
            'any.required': 'Nama template wajib diisi.'
        }),
    subject: Joi.string()
        .min(5)
        .max(100)
        .required()
        .messages({
            'string.base': 'Subjek email harus berupa teks.',
            'string.empty': 'Subjek email tidak boleh kosong.',
            'string.min': 'Subjek email harus memiliki minimal {#limit} karakter.',
            'string.max': 'Subjek email harus memiliki maksimal {#limit} karakter.',
            'any.required': 'Subjek email wajib diisi.'
        }),
    body: Joi.string()
        .required()
        .messages({
            'string.base': 'Isi email harus berupa teks.',
            'string.empty': 'Isi email tidak boleh kosong.',
            'any.required': 'Isi email wajib diisi.'
        }),
});

// Fungsi untuk memvalidasi template email
const validateEmailTemplate = (req, res, next) => {
    const { error } =  emailtemplateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateEmailTemplate,
};
