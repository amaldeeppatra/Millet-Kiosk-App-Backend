require("dotenv").config();
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { loginSuccess, logout } = require("../../../controllers/authController");
const { createTokenForUser } = require("../../../services/authentication");

const router = express.Router();

// Google OAuth login route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = createTokenForUser(req.user);
    const role = req.user.role;
    console.log(role)

    if (role === "CUSTOMER") {
      return res.redirect(
        `${process.env.VITE_APP_URL}/homepage?token=${token}`
      );
    } else {
      // For SELLER or ADMIN
      return res.redirect(
        `${process.env.VITE_APP_URL}/choose-role?token=${token}&role=${role}`
      );
    }
  }
);

router.get("/verify", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "User not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Token is invalid or expired" });
    }

    res.status(200).json({
      success: true,
      message: "User successfully authenticated",
      user: user,
    });
  });
});

// Logout route
router.get("/logout", logout);

// Login success route (for checking user data on the frontend)
router.get("/login/success", loginSuccess);

module.exports = router;
