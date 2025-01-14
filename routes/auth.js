const express = require('express');
const passport = require('passport');
const { loginSuccess, logout } = require('../controllers/authController');

const router = express.Router();

// Google OAuth login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/'); // Redirect to home page after successful login
  }
);

// Logout route
router.get('/logout', logout);

// Login success route
router.get('/login/success', loginSuccess);

module.exports = router;