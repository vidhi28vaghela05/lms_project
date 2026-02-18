const express = require('express');
const { createSkill, getSkills, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(getSkills)
  .post(protect, authorize('admin'), createSkill);

router.route('/:id')
  .put(protect, authorize('admin'), updateSkill)
  .delete(protect, authorize('admin'), deleteSkill);

module.exports = router;
