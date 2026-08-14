// backend/src/controllers/userController.js
const db = require('../config/database');

/**
 * Search for users by phone number or display name.
 * Excludes the currently logged-in user from the results.
 */
exports.searchUsers = (req, res) => {
  const { query } = req.query;
  const currentUserId = req.user.id;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    // Use LIKE for partial matching on either phone_number or display_name
    const users = db.prepare(`
      SELECT id, phone_number, display_name, avatar_url, about 
      FROM users 
      WHERE (phone_number LIKE ? OR display_name LIKE ?) 
      AND id != ?
    `).all(`%${query}%`, `%${query}%`, currentUserId);

    res.status(200).json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Internal server error during user search' });
  }
};

/**
 * Get all contacts for the currently logged-in user.
 */
exports.getContacts = (req, res) => {
  const currentUserId = req.user.id;

  try {
    const contacts = db.prepare(`
      SELECT u.id, u.phone_number, u.display_name, u.avatar_url, u.about, u.last_seen
      FROM contacts c
      JOIN users u ON c.contact_id = u.id
      WHERE c.user_id = ?
      ORDER BY u.display_name ASC
    `).all(currentUserId);

    res.status(200).json({ contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Internal server error while fetching contacts' });
  }
};

/**
 * Add a new contact.
 */
exports.addContact = (req, res) => {
  const { contact_id } = req.body;
  const currentUserId = req.user.id;

  if (!contact_id) {
    return res.status(400).json({ message: 'Contact ID is required' });
  }

  if (contact_id === currentUserId) {
    return res.status(400).json({ message: 'You cannot add yourself as a contact' });
  }

  try {
    // Check if the contact user actually exists
    const userExists = db.prepare('SELECT id FROM users WHERE id = ?').get(contact_id);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already contacts
    const existingContact = db.prepare('SELECT * FROM contacts WHERE user_id = ? AND contact_id = ?').get(currentUserId, contact_id);
    if (existingContact) {
      return res.status(400).json({ message: 'User is already in your contacts' });
    }

    // Add to contacts table
    db.prepare('INSERT INTO contacts (user_id, contact_id) VALUES (?, ?)').run(currentUserId, contact_id);

    // Fetch the newly added contact's details to return to the frontend
    const newContact = db.prepare('SELECT id, phone_number, display_name, avatar_url, about, last_seen FROM users WHERE id = ?').get(contact_id);

    res.status(201).json({ 
      message: 'Contact added successfully',
      contact: newContact
    });
  } catch (error) {
    console.error('Add contact error:', error);
    res.status(500).json({ message: 'Internal server error while adding contact' });
  }
};

/**
 * Update logged-in user's profile (display name, avatar, about)
 */
exports.updateProfile = (req, res) => {
  const { display_name, avatar_url, about } = req.body;
  const currentUserId = req.user.id;

  if (!display_name) {
    return res.status(400).json({ message: 'Display name cannot be empty' });
  }

  try {
    db.prepare(`
      UPDATE users 
      SET display_name = ?, avatar_url = ?, about = ?
      WHERE id = ?
    `).run(display_name, avatar_url, about, currentUserId);

    // Fetch and return the updated user
    const updatedUser = db.prepare('SELECT id, phone_number, display_name, avatar_url, about, last_seen FROM users WHERE id = ?').get(currentUserId);
    
    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error while updating profile' });
  }
};