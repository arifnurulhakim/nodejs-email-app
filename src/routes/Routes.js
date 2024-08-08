const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/UserController');
const CategoryController = require('../controllers/CategoryController');
const ProductController = require('../controllers/ProductController');
const BannerController = require('../controllers/BannerController');
const EmailController = require('../controllers/EmailController');
const EmailTemplateController = require('../controllers/EmailTemplateController');
const userRequest = require('../requests/userRequest');
const categoryRequest = require('../requests/categoryRequest');
const productRequest = require('../requests/productRequest');
const emailRequest = require('../requests/emailRequest');
const emailtemplateRequest = require('../requests/emailtemplateRequest');
const authenticateToken = require('../middleware/authMiddleware'); // Import the middleware

const upload = multer({ dest: 'uploads/' }); // Set the upload directory

// Public routes (no authentication required)
router.post('/login', userRequest.validateLogin, UserController.login);
router.post('/register', userRequest.validateUser, UserController.register);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);
router.post('/login/email', UserController.loginWithEmail);
router.post('/login/verif', UserController.verifyOtp);

// Protected routes (authentication required)
router.use(authenticateToken); // Apply middleware to all routes below this line

// CRUD routes for Users
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', userRequest.validateUser, UserController.createUser);
router.put('/users/:id', userRequest.validateUser, UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

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

// Email templates routes
router.get('/email-templates', EmailTemplateController.getAllEmailTemplates);
router.get('/email-templates/:id', EmailTemplateController.getEmailTemplateById);
router.post('/email-templates', emailtemplateRequest.validateEmailTemplate, EmailTemplateController.createEmailTemplate);
router.put('/email-templates/:id', emailtemplateRequest.validateEmailTemplate, EmailTemplateController.updateEmailTemplate);
router.delete('/email-templates/:id', EmailTemplateController.deleteEmailTemplate);

// Route to send emails
router.post('/emails-send', EmailController.sendEmails); // Route to send emails

// Route to get all sent emails
router.get('/emails-sent', EmailController.getAllSentEmails); // Route to get sent emails

module.exports = router;
