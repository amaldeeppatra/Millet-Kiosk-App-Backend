exports.loginSuccess = (req, res) => {
    if (req.user) {
      res.cookie('auth_token', token, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
            sameSite: 'strict', // Mitigates CSRF attacks
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      });
      res.status(200).json({
        success: true,
        message: 'User successfully authenticated',
        user: req.user,
      });
    } else {
      res.status(401).json({ success: false, message: 'User not authenticated' });
    }
  };
  
  exports.logout = (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Logout failed' });
      }
      res.status(200).json({ success: true, message: 'User logged out' });
    });
  };
  