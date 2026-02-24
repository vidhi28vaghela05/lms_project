const express = require('express');
const router = express.Router();
const { 
  getConversations, 
  getMessages, 
  getOrCreateConversation,
  createGroup,
  getChatPartners 
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/partners', getChatPartners);
router.get('/conversations', getConversations);
router.post('/conversation', getOrCreateConversation);
router.get('/messages/:conversationId', getMessages);
router.post('/group', createGroup);

module.exports = router;
