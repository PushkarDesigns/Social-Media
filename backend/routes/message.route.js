// Import the core express library
import express from "express";
// Import a custom middleware function to ensure the user is authenticated
import isAuthenticated from "../middlewares/isAuthentication.js";
// Import a middleware (likely for file uploads, though unused in the routes below)
import upload from "../middlewares/multer.js";
// Import specific controller functions that handle the core logic for messages
import { getMessage, sendMessage } from "../controllers/message.controller.js";

// Create a new router instance from Express
const router = express.Router();

// Define a POST route for sending a message to a specific user ID
// It applies the authentication middleware first, then the sendMessage controller
router.route('/send/:id').post(isAuthenticated, sendMessage);

// Define a GET route for retrieving all messages for a specific conversation ID
// It also requires authentication middleware first, then the getMessage controller
router.route('/all/:id').get(isAuthenticated, getMessage);

// Export the configured router so it can be used in the main application file
export default router;
