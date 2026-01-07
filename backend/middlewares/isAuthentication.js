import jwt from "jsonwebtoken";
// /**
//  * Middleware to authenticate a user using a JWT token from cookies.
//  * @param {object} req - Express request object
//  * @param {object} res - Express response object
//  * @param {function} next - Express next function
//  */
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        message: 'User not authenticated',
        success: false
      });
    }
    // Verify the token
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    // Check if verification failed (though jwt.verify usually throws an error)
    if (!decode) {
      return res.status(401).json({
        message: 'Invalid token',
        success: false
      });
    }
    req.id = decode.userId
    // If successful, proceed to the next middleware or route handler (implied 'next()' is missing in the image)
    next(); //call after function isAuthenticated 

  } catch (error) {
    console.log(error);
    // Handle error (e.g., jwt expired, invalid signature etc.)
    return res.status(401).json({
      message: 'Authentication failed',
      success: false
    });
  }
};

export default isAuthenticated;