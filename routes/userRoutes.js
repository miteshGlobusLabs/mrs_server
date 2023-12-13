// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Login
router.post('/login', userController.loginUser);

// Registration
router.post('/register', userController.registerUser);
router.get('/registrations', userController.getAllRegistrations);

// Logout from single device
router.get('/logout', auth, userController.logoutUser);

// Logout from all devices
router.get('/logout/all', auth, userController.logoutAllDevices);

module.exports = router;
