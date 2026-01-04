import mongoose, { mongo } from "mongoose";

// post model 
const postSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    uploadImage: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "Rather not say"],
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
