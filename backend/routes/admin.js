const express = require('express');
const { getAllUsers, getSystemAnalytics } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/analytics', protect, authorize('admin'), getSystemAnalytics);

module.exports = router;
