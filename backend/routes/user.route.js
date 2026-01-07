// Import the core express library.
import express from "express";

// Import controller functions for login, logout, and register from a specific file path.
import {
  getProfile,
  login,
  logout,
  register
} from "../controllers/user.controller.js";

// Import a middleware function used for authenticating requests.
import isAuthenticated from "../middlewares/isAuthenticated.js";

// Create a new router instance from express.
const router = express.Router();

// Define a POST route for user registration, linking it to the 'register' controller function.
router.route("/register").post(register);

// Define a POST route for user login, linking it to the 'login' controller function.
router.route("/login").post(login);

// Define a GET route for user logout, linking it to the 'logout' controller function.
router.route("/logout").get(logout);

// Define a GET route for fetching a specific user's profile using a dynamic ID parameter.
// This route is protected by the 'isAuthenticated' middleware, meaning a valid token/session
// is required before the subsequent (unseen) profile controller logic runs.
router.route("/:id/profile").get(isAuthenticated,getProfile /* , profileControllerFunction */ );
router.route("/profile/edit").get(isAuthenticated, /* , profileControllerFunction */ );
