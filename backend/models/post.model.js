import mongoose from "mongoose";

// post model 
const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      require: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: []
      }
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },{ timestamps: true }
);
const Post = mongoose.model("Post", postSchema);
export default Post;
// import mongoose from "mongoose";
// const postSchema = new mongoose.Schema({
//     caption: { type: String, default: '' },
//     image: { type: String, required: true },
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     // likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
//     // comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],
//     likes: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: "User",
//         default: []
//     },
//     comments: {
//         type: Array,
//         default: []
//     }

// });
// const Post = mongoose.model('Post', postSchema);
// export default Post;