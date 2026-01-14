import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDatauri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.model.js";

// user register / singhup
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body; // object destruction
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Something is missing, Please check!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exists",
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
    console.log(error);
    return res.status(500).json({
      message: "Server error during signup",
      success: false
    });
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
    let user = await User.findOne({ email });
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

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "10d", });
    // populate each post if in the posts array
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      uploadImage: user.uploadImage,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      post: populatedPosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
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
    let user = await User.findById(userId).select("-password");

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
    const { bio, gender } = req.body;
    // Extract the uploaded 'uploadImage' file object from 'req.file'
    // (this is typically populated by middleware like Multer).
    const uploadImage = req.file;

    // Declare a variable to store the response from a cloud service (e.g., Cloudinary, AWS S3).
    let cloudResponse;

    // Check if a upload Image was actually uploaded.
    if (uploadImage) {
      // If a file exists, use a utility function (getDataUri) to convert the file buffer
      // into a Data URI string, which can be easily used for uploads or embedding.
      const fileUri = getDatauri(uploadImage);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);

      // Subsequent code would likely involve using the fileUri to upload the image
      // to cloud storage and then updating the user's profile information in a database.
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }
    // Check if the 'bio' field was provided and update the user object if so.
    if (bio) user.bio = bio;

    // Check if the 'gender' field was provided and update the user object if so.
    if (gender) user.gender = gender;

    // Check if a 'uploadImage' was processed and update the user's profile picture
    // URL using the secure URL returned from the cloud service response.
    if (uploadImage) user.uploadImage = cloudResponse.secure_url;

    await user.save();

    // This snippet shows how to send a successful HTTP response (Status 200 OK)
    // after a profile update operation is complete.

    return res.status(200).json({
      // A success message for the client.
      message: "Profile updated.",
      // A boolean flag indicating success.
      success: true,
      // The updated user object, which is sent back as part of the JSON response.
      user,
    });
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

// Function to fetch a list of users, excluding the current user themselves.
export const getSuggestedUsers = async (req, res) => {
  try {
    // Find all users in the database where the '_id' does not equal the current request user's ID,
    // and specifically exclude the 'password' field from the results.
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );

    // If no users are found (e.g., only the current user exists in the DB).
    if (!suggestedUsers.length === 0)
      return res.status(404).json({
        message: "Currently do not have any users", // Return a 404 Not Found status.
        success: false,
      });

    // If users are found, return them with a 200 OK status.
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    // Log any server errors to the console.
    console.log(error);
  }
};

// Function stub for handling follow/unfollow logic.
export const followOrUnfollow = async (req, res) => {
  try {
    // Identify the ID of the user initiating the action (the follower).
    const followKrneWala = req.id; // "one who will follow"
    // Identify the ID of the target user being followed/unfollowed.
    const jiskoFollowKrunga = req.params.id; // "one who I will follow"
    // Check if the user is trying to follow/unfollow themselves.
    if (followKrneWala === jiskoFollowKrunga) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself.",
        success: false,
      });
    }

    // Find both the current user and the target user in the database.
    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollowKrunga);

    // Check if either user was not found.
    if (!user || !targetUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Check if the current user is already following the target user.
    const isFollowing = user.following.includes(jiskoFollowKrunga);

    if (isFollowing) {
      // Unfollow logic:
      // In a real application, you would remove the target user from the current
      // user's 'following' array and remove the current user from the target user's 'followers' array.
      // e.g., await User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } });
      // e.g., await User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } });
      await User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } });
      await User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } });
      return res.status(200).json({ message: 'Unfollow successfully', success: true });
    } else {
      // Follow logic:
      // Use Promise.all to ensure both database updates happen concurrently and efficiently.
      await Promise.all([
        // Add the target user to the current user's 'following' array.
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollowKrunga } }
        ),
        // Add the current user to the target user's 'followers' array.
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);
      return res.status(200).json({ message: 'followed successfully', success: true });
    }

    // In a real application, you would send a success response here after the logic is complete.
    // e.g., return res.status(200).json({ message: 'Operation successful.', success: true });
  } catch (error) {
    // Log any server errors to the console.
    console.log(error);
  }
};