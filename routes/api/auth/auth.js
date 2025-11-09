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
  (req, res, next) => {
    // Pass the state from frontend to Passport
    const state = req.query.state || "kiosk";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state, // this will be preserved by Google
    })(req, res, next);
  }
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("✅ Google callback received with query:", req.query);
    const token = createTokenForUser(req.user);
    const role = req.user.role;
    const platform = req.query.state || 'kiosk'; // Extracts 'integrated' from state

    let redirectBase =
      platform === 'integrated'
        ? process.env.VITE_APP_URL_INTEGRATED
        : process.env.VITE_APP_URL;

    console.log("Redirecting to:", redirectBase);
    if (platform === "integrated") {
      return res.redirect(`${redirectBase}/?token=${token}`);
    }

    if (role === "CUSTOMER") {
      return res.redirect(`${redirectBase}/homepage?token=${token}`);
    } else {
      return res.redirect(`${redirectBase}/choose-role?token=${token}&role=${role}`);
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
