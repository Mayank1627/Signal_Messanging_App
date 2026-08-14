// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// All routes in this file are protected
router.use(protect);

// Route to search for users by phone number or name
// GET /api/users/search?query=12345
router.get('/search', userController.searchUsers);

// Route to get all contacts of the logged-in user
router.get('/contacts', userController.getContacts);

// Route to add a new contact
router.post('/contacts', userController.addContact);

router.put('/profile', userController.updateProfile);

module.exports = router;

