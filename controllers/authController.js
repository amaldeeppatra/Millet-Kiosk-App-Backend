exports.loginSuccess = (req, res) => {
    if (req.user) {
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
  