const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  getCaptcha,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/captcha', getCaptcha);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', protect, getUserProfile);

module.exports = router;



