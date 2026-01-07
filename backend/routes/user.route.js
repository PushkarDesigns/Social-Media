// Import the core express library.
import express from "express";

// Import controller functions for login, logout, and register from a specific file path.
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register
} from "../controllers/user.controller.js";

// Import a middleware function used for authenticating requests.
import isAuthenticated from "../middlewares/isAuthentication.js";
import upload from "../middlewares/multer.js";

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
router.route("/profile/edit").post(isAuthenticated, upload.single('uploadImage'), editProfile /* , profileControllerFunction */ );
router.route("/suggested").get(isAuthenticated, getSuggestedUsers); // isAuthenticated: This function is likely used for authentication, verifying that the user making the request is logged in before allowing them access to the route.
// getSuggestedUsers: This is the route handler that runs if the user is authenticated, fetching and returning a list of suggested users.
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);  // This sets up a POST endpoint at the path /followorunfollow/, which also expects a dynamic id parameter in the URL (e.g., /followorunfollow/123).
// It also uses the isAuthenticated middleware for authentication.
// followOrUnfollow: This is the route handler that executes if the user is authenticated. It presumably uses the provided id to either follow or unfollow the specified user

export default router