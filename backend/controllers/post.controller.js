// Import the sharp library for image processing
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

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
