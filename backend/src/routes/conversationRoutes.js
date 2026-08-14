// backend/src/routes/conversationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const conversationController = require('../controllers/conversationController');

// All routes in this file are protected
router.use(protect);

// Route to get all conversations for the logged-in user
router.get('/', conversationController.getConversations);

// Route to create or fetch a 1-on-1 conversation
router.post('/direct', conversationController.createDirectConversation);

// Route to create a group conversation
router.post('/group', conversationController.createGroupConversation);

// Route to get all messages for a specific conversation
router.get('/:conversation_id/messages', conversationController.getMessages);

//  --- NEW GROUP MANAGEMENT ROUTES ---
router.get('/:conversation_id/participants', conversationController.getParticipants);
router.post('/:conversation_id/participants', conversationController.addGroupMember);
router.delete('/:conversation_id/participants/:user_id', conversationController.removeGroupMember);

module.exports = router;