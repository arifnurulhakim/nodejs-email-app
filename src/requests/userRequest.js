const Joi = require('joi');

// Skema validasi untuk pengguna
const userSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Must be a valid email address',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

// Validator untuk membuat dan memperbarui pengguna
exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }
  next();
};

// Validator untuk login
exports.validateLogin = (req, res, next) => {
  const loginSchema = Joi.object({
    username: Joi.string().required().messages({
      'string.empty': 'Username is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
    }),
  });

  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }
  next();
};

// Validator untuk login dengan email
exports.validateEmailLogin = (req, res, next) => {
  const emailLoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email is required',
      'string.email': 'Must be a valid email address',
    }),
  });

  const { error } = emailLoginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }
  next();
};

// Validator untuk verifikasi OTP
exports.validateOtp = (req, res, next) => {
  const otpSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email is required',
      'string.email': 'Must be a valid email address',
    }),
    otp: Joi.string().length(6).required().messages({
      'string.base': 'OTP must be a string',
      'string.empty': 'OTP is required',
      'string.length': 'OTP must be 6 characters long',
    }),
  });

  const { error } = otpSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }
  next();
};
