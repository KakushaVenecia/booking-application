const express = require('express');
const router = express.Router();
const { me,login, forgotPassword, resetPassword, register } = require('../controllers/authController');


// Register
router.post('/login', login);
router.post('/register', register);
router.get('/me', me);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);



module.exports = router;