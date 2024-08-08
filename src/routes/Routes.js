const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/UserController');
const CategoryController = require('../controllers/CategoryController');
const ProductController = require('../controllers/ProductController');
const BannerController = require('../controllers/BannerController');
const EmailController = require('../controllers/EmailController'); // Tambahkan import untuk EmailController
const userRequest = require('../requests/userRequest'); // User validators
const categoryRequest = require('../requests/categoryRequest'); // Category validators
const productRequest = require('../requests/productRequest'); // Product validators
const emailRequest = require('../requests/emailRequest'); // Email validators
const EmailTemplateController = require('../controllers/EmailTemplateController'); // Import EmailTemplateController
const emailtemplateRequest = require('../requests/emailtemplateRequest'); // Import validator


const upload = multer({ dest: 'uploads/' }); // Set the upload directory

// CRUD routes for Users
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', userRequest.validateUser, UserController.createUser);
router.put('/users/:id', userRequest.validateUser, UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// Authentication routes
router.post('/login', userRequest.validateLogin, UserController.login);
router.post('/register', userRequest.validateUser, UserController.register);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);

// New routes for email login with OTP
router.post('/login/email', UserController.loginWithEmail);
router.post('/login/verif', UserController.verifyOtp);

// CRUD routes for Categories
router.get('/categories', CategoryController.getAllCategories);
router.get('/categories/:id', CategoryController.getCategoryById);
router.post('/categories', categoryRequest.validateCategory, CategoryController.createCategory);
router.put('/categories/:id', categoryRequest.validateCategory, CategoryController.updateCategory);
router.delete('/categories/:id', CategoryController.deleteCategory);

// CRUD routes for Products
router.get('/products', ProductController.getAllProducts);
router.get('/products/:id', ProductController.getProductById);
router.post('/products', productRequest.validateProduct, ProductController.createProduct);
router.put('/products/:id', productRequest.validateProduct, ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);

// Route for importing products
router.post('/import-products', upload.single('file'), ProductController.importProducts);
router.get('/export-products', ProductController.exportProducts);

// CRUD routes for Banners
router.get('/banners', BannerController.getAllBanners);
router.get('/banners/:id', BannerController.getBannerById);
router.post('/banners', upload.single('image'), BannerController.createBanner); // Upload image
router.put('/banners/:id', upload.single('image'), BannerController.updateBanner); // Upload image if needed
router.delete('/banners/:id', BannerController.deleteBanner);

// CRUD routes for Emails
router.get('/emails', EmailController.getAllEmails);
router.get('/emails/:id', EmailController.getEmailById);
router.post('/emails', emailRequest.validateEmail, EmailController.createEmail);
router.put('/emails/:id', emailRequest.validateEmail, EmailController.updateEmail);
router.delete('/emails/:id', EmailController.deleteEmail);

router.get('/email-templates', EmailTemplateController.getAllEmailTemplates);
router.get('/email-templates/:id', EmailTemplateController.getEmailTemplateById);
router.post('/email-templates', emailtemplateRequest.validateEmailTemplate, EmailTemplateController.createEmailTemplate);
router.put('/email-templates/:id', emailtemplateRequest.validateEmailTemplate, EmailTemplateController.updateEmailTemplate);
router.delete('/email-templates/:id', EmailTemplateController.deleteEmailTemplate);

router.post('/emails-send', EmailController.sendEmails); // Rute untuk mengirim email

// Route untuk mengambil semua email yang terkirim
router.get('/emails-sent', EmailController.getAllSentEmails); // Rute untuk mendapatkan email yang sudah terkirim



module.exports = router;
