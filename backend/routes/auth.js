const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  verifyOTP, 
  resendOTP, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', protect, getUserProfile);

module.exports = router;


