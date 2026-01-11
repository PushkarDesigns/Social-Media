// Import the core express library to create and manage routes
import express from "express";
// Import a custom middleware function to ensure users are logged in before accessing protected routes
import isAuthenticated from "../middlewares/isAuthentication.js";
// Import a middleware function (likely Multer) used to handle file uploads, such as images for posts
import upload from "../middlewares/multer.js";
// Import specific controller functions that contain the application logic for different actions
import { addComment, addNewPost, bookmarkPost, deletePost, likePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost } from "../controllers/post.controller.js";

// Initialize a new router instance provided by Express to define application routes
const router = express.Router();

// Define API endpoints using the router:
// Route to add a new post: requires authentication, handles a single image file upload ('image'), then calls addNewPost
router.route("/addpost").post(isAuthenticated, upload.single('image'), addNewPost);
// Route to get all posts: requires authentication, then calls getAllPost
router.route("/all").get(isAuthenticated, getAllPost);
// Route to get all posts for a specific user: requires authentication, then calls getUserPost
router.route("/userpost/all").get(isAuthenticated, getUserPost);
// Route to like a post (using the post ID as a URL parameter): requires authentication, then calls LikePost (Typo in original code should be 'likePost')
router.route("/:id/like").get(isAuthenticated, likePost);
// Route to dislike a post (using the post ID as a URL parameter): requires authentication, then calls dislikePost
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
// Route to add a comment to a post: requires authentication, then calls addComment
router.route("/:id/comment").post(isAuthenticated, addComment);
// Route to get all comments for a post: requires authentication, then calls getCommentsOfPost
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost);
// Route to delete a specific post: requires authentication, then calls deletePost
router.route("/delete/:id").post(isAuthenticated, deletePost);
// Route to bookmark a post: requires authentication, then calls bookmarkPost
router.route("/:id/bookmark").post(isAuthenticated, bookmarkPost);
// Export the configured router so it can be used in the main application file (e.g., index.js or app.js)
export default router;
