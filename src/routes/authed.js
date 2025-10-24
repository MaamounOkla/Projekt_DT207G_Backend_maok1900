
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const authenticatedToken = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_Key;

// Only one admin
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

// Login route only
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Användarnamn och lösenord måste fyllas i' });
    }

    // check against env admin
    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return res.status(401).json({ message: 'Ogiltigt Användarnamn/lösenord' });
    }

    // sign token
    const token = jwt.sign(
      { username: ADMIN_USER, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Admin logged in', token });
  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Example protected route
router.get('/protected', authenticatedToken, (req, res) => {
  res.json({ message: 'Welcome, admin!', user: req.user });
});

module.exports = router;
