// backend/src/controllers/authController.js
const db = require('../config/database');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');

// Mocked OTP for the assignment
const MOCK_OTP = '123456';

/**
 * Step 1 of Auth Flow: User enters phone number.
 * We check if the user exists. We simulate sending an OTP.
 * For this assignment, we return a temporary token or just a success message indicating OTP was "sent".
 */
exports.requestOtp = (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // In a real app, we'd generate an OTP and send it via SMS.
  // Here, we just acknowledge the request.
  res.status(200).json({ 
    message: 'OTP sent successfully (Mocked: use 123456)',
    phone_number 
  });
};

/**
 * Step 2 of Auth Flow: User verifies OTP.
 * If OTP is correct, we check if user exists.
 * If user exists -> Login (Generate JWT).
 * If user doesn't exist -> Return a temporary token to proceed to profile setup.
 */
exports.verifyOtp = (req, res) => {
  const { phone_number, otp } = req.body;

  if (!phone_number || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  if (otp !== MOCK_OTP) {
    return res.status(400).json({ message: 'Invalid OTP. Please use 123456' });
  }

  // Check if user already exists
  const user = db.prepare('SELECT * FROM users WHERE phone_number = ?').get(phone_number);

  if (user) {
    // User exists -> Login them in
    const token = generateToken({ id: user.id, phone_number: user.phone_number });
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        phone_number: user.phone_number,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        about: user.about
      },
      isNewUser: false
    });
  } else {
    // User doesn't exist -> Tell frontend to go to profile setup
    return res.status(200).json({
      message: 'OTP verified. Please complete profile setup.',
      isNewUser: true,
      phone_number
    });
  }
};

/**
 * Step 3 of Auth Flow: New user completes profile setup.
 */
exports.register = (req, res) => {
  const { phone_number, display_name, avatar_url, password } = req.body;

  if (!phone_number || !display_name) {
    return res.status(400).json({ message: 'Phone number and display name are required' });
  }

  // Check if user already exists (safety check)
  const existingUser = db.prepare('SELECT * FROM users WHERE phone_number = ?').get(phone_number);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists. Please login.' });
  }

  const userId = crypto.randomUUID();
  
  // Hash password if provided (optional for this mock, but good practice)
  let password_hash = null;
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    password_hash = bcrypt.hashSync(password, salt);
  }

  // Insert new user into database
  try {
    db.prepare(`
      INSERT INTO users (id, phone_number, display_name, avatar_url, password_hash)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, phone_number, display_name, avatar_url || null, password_hash);

    // Fetch the newly created user
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    // Generate JWT for the new user
    const token = generateToken({ id: newUser.id, phone_number: newUser.phone_number });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        phone_number: newUser.phone_number,
        display_name: newUser.display_name,
        avatar_url: newUser.avatar_url,
        about: newUser.about
      },
      isNewUser: false
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
};

/**
 * Get current logged-in user's details
 */
exports.getMe = (req, res) => {
  // req.user is set by the auth middleware (which we will create next)
  const user = db.prepare('SELECT id, phone_number, display_name, avatar_url, about, last_seen FROM users WHERE id = ?').get(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ user });
};