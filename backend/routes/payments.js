const express = require('express');
const { createCheckoutSession, submitUPIPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/upi-submit', protect, submitUPIPayment);

module.exports = router;
