const authorize = (allowedRoles) => {
  // The returned function is the actual middleware that Express will execute.
  return (req, res, next) => {
    
    // Step 1: Check if the user object and role exist on the request.
    // This is a safeguard in case the authentication middleware failed to run or populate req.user correctly.
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: User role is not available for authorization.'
      });
    }

    // Step 2: Get the user's role from the populated req.user object.
    const userRole = req.user.role;

    // Step 3: Check if the user's role is in the array of allowed roles.
    // The .includes() method is a clean and efficient way to do this.
    if (allowedRoles.includes(userRole)) {
      
      // If the role is permitted, pass control to the next middleware in the chain,
      // or to the final route handler.
      next();

    } else {
      
      // If the role is not permitted, send a 403 Forbidden response and stop the request chain.
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have the required permissions to access this resource.'
      });
    }
  };
};

module.exports = authorize;