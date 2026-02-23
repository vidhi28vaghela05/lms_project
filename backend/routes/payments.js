const express = require('express');
const { createCheckoutSession, submitUPIPayment, getMyPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/upi-submit', protect, submitUPIPayment);
router.get('/history', protect, getMyPaymentHistory);

module.exports = router;
