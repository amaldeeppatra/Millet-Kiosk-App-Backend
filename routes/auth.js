require('dotenv').config();
const express = require('express');
const passport = require('passport');
const { loginSuccess, logout } = require('../controllers/authController');
const { createTokenForUser } = require('../services/authentication');

const router = express.Router();

// Google OAuth login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // const token = createTokenForUser(req.user);
    // Set the JWT as an HttpOnly cookie so it's not accessible via JavaScript.
    // res.cookie('auth_token', token, {
      // httpOnly: true, // Prevents JS access (helps mitigate XSS)
      // secure: process.env.NODE_ENV, // Only send cookie over HTTPS in production
      // sameSite: 'strict',
    //   maxAge: 1 * 60 * 60 * 1000, // 7 hours in milliseconds
    // });
    
    // Check if the user already has a phone number (i.e. is an existing user).
    // Adjust this condition based on your user schema (e.g., using a field like "phone" or "isNewUser")
    // if (!req.user.email) {
    //   // New user: redirect to the page for entering phone number.
    //   res.redirect(`${process.env.VITE_APP_URL}/login-phone`);
    // } else {
    //   // Existing user: redirect to the homepage.
    //   res.redirect(`${process.env.VITE_APP_URL}/homepage`);
    // }
    res.redirect(`${process.env.VITE_APP_URL}/homepage`);
  }
);

// Logout route
router.get('/logout', logout);

// Login success route (for checking user data on the frontend)
router.get('/login/success', loginSuccess);

module.exports = router;
