import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDatauri from "../utils/dataUri.js";

// user register / singhup
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body; // object destruction
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, Please check!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Try different email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account Created Successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// user login / sign in

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    let user = await user.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    user = {
      _id: user._id,
      email: user.email,
      uploadImage: user.uploadImage,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      post: user.posts,
    };

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expriesIn: "10d",
    });
    return res
      .cookie("token", token, {
        httpOnly: true,
        samesite: "strict",
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Express controller function to get a user profile by ID.
 * Expects the user ID in the request parameters (e.g., /profile/:id).
 */
export const getProfile = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const userId = req.params.id;

    // Find the user in the database by their ID
    let user = await User.findById(userId);

    // Return a success response with the user data
    return res.status(200).json({
      user, // shorthand for user: user
      success: true,
    });
  } catch (error) {
    // Log any errors that occur during the process
    console.log(error);
  }
};

// Export a controller function named 'editProfile'. It is an asynchronous function
// that handles an HTTP request (req) and response (res) typically in an Express.js environment.
export const editProfile = async (req, res) => {
  try {
    // Extract the 'userId' from the request object's custom 'id' property
    // (likely set by a prior authentication middleware).
    const userId = req.id;
    // Extract 'bio' and 'gender' text fields from the request body.
    const {
      bio,
      gender
    } = req.body;
    // Extract the uploaded 'uploadImage' file object from 'req.file'
    // (this is typically populated by middleware like Multer).
    const uploadImage = req.file;

    // Declare a variable to store the response from a cloud service (e.g., Cloudinary, AWS S3).
    let cloudResponse;

    // Check if a upload Image was actually uploaded.
    if (profilePicture) {
      // If a file exists, use a utility function (getDataUri) to convert the file buffer
      // into a Data URI string, which can be easily used for uploads or embedding.
      const fileUri = getDatauri(uploadImage);

      // Subsequent code would likely involve using the fileUri to upload the image
      // to cloud storage and then updating the user's profile information in a database.
    }

  } catch (error) {
    // Catch any errors that occur during the process and log them to the console.
    console.log(error);
    // In a full application, you would also send an error response to the client here (e.g., res.status(500).send('Error')).
  }
};


export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
