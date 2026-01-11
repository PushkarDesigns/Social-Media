// Import the sharp library for image processing
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";

// Define an asynchronous function to handle a new post request (typical in)
export const addNewPost = async (req, res) => {
  try {
    // Extract data from the request body and the uploaded file
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    // Check if an image file was actually uploaded. If not, send an error response.
    if (!image) return res.status(400).json({ message: "Image required" });

    // --- Image Optimization using Sharp ---

    // Use 'await' because sharp operations are asynchronous (they take time)
    const optimizedImageBuffer = await sharp(image.buffer) // Start processing the image data stored in a buffer
      .resize({ width: 800, height: 800, fit: "inside" }) // Resize the image to fit inside 800x800 pixels while maintaining aspect ratio
      .toFormat("jpeg", { quality: 80 }) // Convert the image to JPEG format and set the quality to 80%
      .toBuffer(); // Convert the processed image back into a buffer (raw data)

    // After this point, you would typically save the 'optimizedImageBuffer'
    // to a storage service (like AWS S3) or a database.
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`; // Placeholder for where the final image URL/URI would go
    // Use 'await' because uploading to a cloud service takes time (is asynchronous)
    // This line uploads the image data located at 'fileuri' to the 'cloudinary' service
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    // Use 'await' because creating a new database entry takes time (is asynchronous)
    // This line creates a new 'Post' record in your database using a 'Post' model
    const post = await Post.create({
      caption, // Adds the post caption
      // Uses the 'secure_url' provided back by Cloudinary after a successful upload
      image: cloudResponse.secure_url,
      author: authorId, // Associates the post with a specific user ID
    });

    // Find a user document in the database using their unique 'authorId'
    const user = await user.findById(authorId);
    // Check if the user was successfully found
    if (user) {
      // If found, add the ID of the new post to the user's list of posts
      user.posts.push(post._id);
      // Save the updated user document back to the database
      await user.save();
    }

    // After the post is saved, replace the 'author' ID reference with the actual user details
    // ('populate'), but specifically exclude their password field for security ('select: "-password"')
    await post.populate({ path: "author", select: "-password" });

    // Send a response back to the client/browser
    return res.status(201).json({
      message: "New post added", // A success message
      post, // The newly created post object (now with author details)
      success: true, // A boolean flag indicating success
    });

    // The rest of the function would handle saving the post details and the fileUri...
  } catch (error) {
    // If any error occurs during the process (e.g., sharp fails), catch and log it
    console.log(error); // This helps with debugging
    // You might also send an error response to the user here
  }
};

// Define and export an asynchronous function to fetch all posts
export const getAllPost = async (req, res) => {
  try {
    // Find all documents in the 'Post' collection and sort them by 'createdAt' in descending order (-1 for newest first)
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      // Populate the 'author' field, replacing the ID with the user document, selecting only 'username' and 'uploadImage' fields
      .populate({ path: "author", select: "username, uploadImage" })
      // Populate the 'comments' array
      .populate({
        path: "comments",
        // Sort comments by creation date within the array
        sort: { createdAt: -1 },
        // Nested population: for each comment, populate its 'author' field
        populate: {
          path: "author",
          select: "username, uploadImage", // Select specific author fields
        },
      });

    // Return a successful response with the retrieved posts and a success flag
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    // Log any errors that occur during the database operation
    console.log(error);
  }
};

// Define and export an asynchronous function to handle fetching a user's posts
export const getUserPost = async (req, res) => {
  try {
    // Extract the authorId from the request object (assuming 'req.id' holds the user ID)
    const authorId = req.id;

    // Use Mongoose to find posts authored by the specified authorId
    const posts = await Post.find({ author: authorId })
      // Sort the results in descending order by creation date (newest first)
      .sort({ createdAt: -1 })
      // Populate the 'author' field with data from the User collection
      .populate({
        path: "author",
        select: "username, uploadImage", // Select only specific fields for the author
      })
      // Populate the 'comments' array within each post
      .populate({
        path: "comments",
        sort: { createdAt: -1 }, // Sort comments by creation date (newest first)
        populate: {
          path: "author", // Populate the 'author' field within each comment
          select: "username, uploadImage", // Select specific fields for the comment author
        },
      });

    // If successful, return a 200 status code and the posts data as a JSON response
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    // If an error occurs, log it to the console
    console.log(error);
  }
};

// Define and export an asynchronous function to handle liking a post
export const likePost = async (req, res) => {
  try {
    // Extract the ID of the user performing the like operation from the request
    const likeKrneWalaUserkiId = req.id;
    // Extract the post ID from the request parameters
    const postId = req.params.id;

    // Find the post by its ID in the database
    const post = await Post.findById(postId);

    // Check if the post exists; if not, return a 404 Not Found error
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // Like logic starter (comment from original code)
    // Use Mongoose's updateOne with $addToSet to ensure the user ID is added to the likes array only once (prevents duplicate likes)
    await Post.updateOne(
      { _id: postId },
      { $addToSet: { likes: likeKrneWalaUserkiId } }
    );

    // Save the updated post document to the database
    await post.save();

    // Implement socket io for real time notification (comment from original code)

    // Return a response to the client
    return (
      res
        // Set the HTTP status code to 200 (OK)
        .status(200)
        // Send a JSON response body containing a success message and flag
        .json({
          message: "Post Liked", // A descriptive message
          success: true, // A boolean flag indicating success
        })
    );
  } catch (error) {
    // Catch and handle any errors that occur during the process
    console.log(error);
  }
};
// Define and export an asynchronous function to handle disliking (removing a like from) a post
export const dislikePost = async (req, res) => {
  try {
    // Extract the ID of the user performing the dislike operation from the request
    const likeKrneWalaUserkiId = req.id;
    // Extract the post ID from the request parameters
    const postId = req.params.id;

    // Find the post by its ID in the database
    const post = await Post.findById(postId);

    // Check if the post exists; if not, return a 404 Not Found error
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // Like logic started (comment from original code)
    // Use Mongoose's updateOne with $pull to remove the user's ID from the 'likes' array
    await post.updateOne({ $pull: { likes: likeKrneWalaUserkiId } });

    // Save the updated post document to the database
    await post.save();

    // Implement socket io for real time notification (comment from original code)

    // If successful, return a 200 status code and a success message as a JSON response
    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    // Catch and handle any errors that occur during the process
    console.log(error);
  }
};
// Define and export an asynchronous function to handle adding a comment to a post
export const addComment = async (req, res) => {
  try {
    // Extract the post ID from the request parameters (assuming route is /posts/:id/comment)
    const postId = req.params.id;
    // Extract the ID of the user creating the comment from the request object (e.g., from a JWT payload)
    const commentKrneWalaUserKiId = req.id;
    // Extract the text content of the comment from the request body
    const { text } = req.body;

    // Optional: Validate input
    if (!text) {
      return res.status(400).json({ message: "Comment text is required", success: false });
    }

    // Create a new Comment document in the database
    const comment = await Comment.create({
      text, // Assign the comment text
      author: commentKrneWalaUserKiId, // Assign the author's ID
      post: postId, // Assign the associated post's ID
    })
      // Populate the 'author' field immediately after creation to return relevant user details in the response
      .populate({
        path: "author",
        select: "username, uploadImage", // Select specific fields from the User model
      });

    // Find the associated post document
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    // Add the newly created comment's ID to the 'comments' array of the post document
    post.comments.push(comment._id);
    // Save the updated post document to persist the new comment reference in the post's comments array
    await post.save();

    // If successful, return a 201 status code (Created) and the newly created comment data as a JSON response
    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    // Catch and handle any errors that occur during the process
    console.log(error);
    // Return a generic 500 Internal Server Error response for unhandled errors
    return res
      .status(500)
      .json({ message: "An internal server error occurred", success: false });
  }
};

// Define and export an asynchronous function to fetch comments for a specific post
export const getCommentsOfPost = async (req, res) => {
  try {
    // Extract the post ID from the request parameters (e.g., from a route like /api/posts/:id/comments)
    const postId = req.params.id;

    // Find all comments associated with the postId
    const comments = await Comment.find({ post: postId })
      // Populate the 'author' field to include specific user details
      .populate("author", "username uploadImage");

    // Check if no comments were found
    if (!comments || comments.length === 0) {
      // If no comments exist, return a 404 Not Found error
      return res
        .status(404)
        .json({ message: "No comments found for this post", success: false });
    }

    // If comments are found, return a 200 OK status with the list of comments
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    // Catch and handle any potential errors during the operation
    console.log(error);
    // Optional: Return a generic 500 Internal Server Error response to the client
    // return res.status(500).json({ message: 'An internal server error occurred', success: false });
  }
};

// Export the deletePost function for use in a router/controller
export const deletePost = async (req, res) => {
  try {
    // Get the post ID from the request parameters (e.g., from the URL '/posts/:id')
    const postId = req.params.id;
    // Get the authenticated user's ID (presumably set by an earlier authentication middleware)
    const authorId = req.id;

    // Find the post in the database using its ID
    const post = await Post.findById(postId);

    // If no post is found, return a 404 Not Found error
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    // Check if the logged-in user is the owner of the post
    // Mongoose ObjectIds are compared after converting them to strings
    if (post.author.toString() !== authorId) {
      // If not the owner, return a 403 Unauthorized error
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete the post from the 'Post' collection in the database
    await Post.findByIdAndDelete(postId);

    // Remove the reference to the deleted post from the user's list of posts
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save(); // Save the updated user document

    // Delete all comments associated with this post from the 'Comment' collection
    await Comment.deleteMany({ post: postId });

    // Return a 200 OK success response to the client
    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    // Catch any errors that occur during the process and log them to the console
    console.log(error);
    // You might also want to send a 500 Internal Server Error response here
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    // Get the post ID from the request parameters (e.g., from the URL '/posts/:id')
    const postId = req.params.id;
    // Get the authenticated user's ID (presumably set by an earlier authentication middleware)
    const authorId = req.id;
    // Find the post in the database using its ID
    const post = await Post.findById(postId);
    // If no post is found, return a 404 Not Found error
    if (!post)
      return res.status(404).json({ message: "Post not found", success: false });
    // Find the user in the database using their ID
    const user = await User.findById(authorId);
    // Check if the user's 'bookmarks' array already includes the post ID
    if (user.bookmarks.includes(post._id)) {
      // If it is bookmarked: remove the post ID from the bookmarks array using $pull
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      // Return a success response indicating the post was unsaved
      return res
        .status(200).json({
          type: "unsaved",
          message: "Post removed from bookmark",
          success: true,
        });
    } else {
      // If it is NOT bookmarked: add the post ID to the bookmarks array using $addToSet (prevents duplicates)
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      // Return a success response indicating the post was bookmarked
      return res.status(200).json({ type: "saved", message: "Post bookmarked", success: true });
    }
  } catch (error) {
    // Catch any errors that occur during the process and log them
    console.log(error);
    // A 500 status response could also be sent here for robust error handling
  }
};
