// import React, { useState } from 'react'
// import { FaRegHeart } from "react-icons/fa"
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import { Dialog, DialogTrigger, DialogContent } from './ui/dialog'
// import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
// import { Button } from './ui/button'
// import CommentDialog from './CommentDialog'
// import { useDispatch, useSelector } from 'react-redux'
// import axios from 'axios'
// import { toast } from 'sonner'
// import { setPosts, setSelectedPost } from '@/redux/postSlice.js'
// import { Badge } from './ui/badge'

// const Post = ({ post }) => {
//   const [text, setText] = useState("");
//   const [open, setOpen] = useState(false);
//   const { user } = useSelector(store => store.auth);
//   const { posts } = useSelector(store => store.post);
//   const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
//   const [postLike, setPostLike] = useState(post?.likes?.length || 0);
//   const [comment, setComment] = useState(post?.comments || []);

//   const dispatch = useDispatch();

//   const changeEventHandler = (e) => {
//     const inputText = e.target.value;
//     if (inputText.trim()) {
//       setText(inputText);
//     } else {
//       setText("");
//     }
//   }

//   const likeOrDisLikeHandler = async () => {
//     try {
//       const action = liked ? 'dislike' : 'like';
//       const res = await axios.get(`http://localhost:3000/api/v1/post/${post._Id}/${action}`, { withCredentials: true });
//       if (res.data.messsage) {
//         const updatedLikes = liked ? postLike - 1 : postLike + 1;
//         setPostLike(updatedLikes);
//         setLiked(!liked);
//         // update post for update screen
//         const updatedPostData = posts.map(sp =>
//           sp._id === post._id ?
//             {
//               ...sp,
//               likes: liked ? sp.likes.filter((id) => id !== user._id) : [...sp.likes, user._id]
//             } : sp
//         );
//         dispatch(setPosts(updatedPostData));
//         toast.success(res.data.messsage);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const commentHandler = async () => {
//     try {
//       const res = await axios.post(`http://localhost:3000/api/v1/post/${post._id}/comment`, { text }, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });
//       console.log(res.data);

//       if (res.data.success) {
//         const updatedCommentData = [...comment, res.data.comment];
//         setComment(updatedCommentData);

//         const updatedPostData = posts.map(spc =>
//           spc._id === post._id ?
//             {
//               ...spc,
//               comments: updatedCommentData
//             } : spc
//         );

//         dispatch(setPosts(updatedPostData));
//         toast.success(res.data.message);
//         setText("");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }


//   const deletePostHandler = async () => {
//     try {
//       const res = await axios.delete(`http://localhost:3000/api/v1/post/delete/${post._id}`, { withCredentials: true })
//       if (res.data.success) {
//         const updatePostData = post.filter((postItem) => postItem?._id !== post?._id);
//         dispatch(setPosts(updatePostData));
//         toast.success(res.data.messsage);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response.data.messsage);
//     }
//   }

//   // // Define an asynchronous arrow function called 'bookmarkHandler'
//   // const bookmarkHandler = async () => {
//   //   // Start a try block to handle any potential errors during the asynchronous operation
//   //   try {
//   //     // Use the 'await' keyword to pause execution until the axios.post() request completes
//   //     // 'axios.post()' sends an HTTP POST request to a server endpoint
//   //     // The response data from the successful request will be stored in the 'res' constant
//   //     const res = await axios.post(/* URL and optional data here */);
//   //   } catch (error) {
//   //     // If an error (e.g., network issue, server error) occurs in the 'try' block,
//   //     // catch it here and log the error details to the console for debugging
//   //     console.log(error);
//   //   }
//   // };

//   // Define an asynchronous arrow function called 'bookmarkHandler'
//   const bookmarkHandler = async () => {
//     // Start a try block to handle any potential errors during the asynchronous operation
//     try {
//       // Use 'await' to pause execution until the axios.get() request completes
//       // Sends an HTTP GET request to the specified endpoint with credentials included
//       const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });

//       // Check if the server response indicates success
//       if (res.data.success) {
//         // Display a success notification (using a library like 'react-hot-toast' or similar)
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       // If an error (e.g., network issue, server error) occurs in the 'try' block,
//       // catch it here and log the error details to the console for debugging
//       console.log(error);
//     }
//   };


//   return (
//     <div className="my-8 w-full max-w-sm mx-auto">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center gap-2">
//           <Avatar>
//             {/* <AvatarImage src={post.author?.profileImage} alt="post_image" /> */}
//             <AvatarImage src={post?.author?.profileUpload} alt="post_image" />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//           <div className="flex items-center gap-3">
//             {/* <h1 className="text-sm font-medium">{post?.author?.username}</h1> */}
//             <h1 className="text-sm font-medium">{post?.author?.username}</h1>
//             {/* {user?._id === post.author._id &&
//               <Badge variant="secondary">Author</Badge>
//             } */}
//             {user?._id === post?.author?._id && <Badge variant="secondary">Author</Badge>}
//           </div>
//         </div>

//         <Dialog>
//           <DialogTrigger asChild>
//             <MoreHorizontal className="cursor-pointer" />
//           </DialogTrigger>
//           <DialogContent className="flex flex-col items-center text-sm text-center">
//             {post?.author?._id !== user?._id && <Button variant="ghost" className="text-[#ED4956] font-bold">
//               Unfollow
//             </Button>}
//             <Button variant="ghost">Add to favorites</Button>
//             {
//               user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant="ghost" className="text-[#ED4956] font-bold">Delete</Button>
//             }
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Image */}
//       <img
//         className="rounded-sm w-full aspect-square object-cover"
//         src={post.image}
//         alt="post_img"
//       />

//       {/* Actions */}
//       <div className="flex items-center justify-between my-3">
//         <div className="flex items-center gap-3">
//           {
//             liked ? <FaRegHeart onClick={likeOrDisLikeHandler} size={'24'} className="cursor-pointer text-red-600" /> : <FaRegHeart onClick={likeOrDisLikeHandler} size={'22px'} className="cursor-pointer hover:text-gray-600" />
//           }
//           <MessageCircle onClick={() => {
//             dispatch(setSelectedPost(post))
//             setOpen(true);
//           }} className="cursor-pointer hover:text-gray-600" />
//           <Send className="cursor-pointer hover:text-gray-600" />
//         </div>
//         <Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600" />
//       </div>

//       {/* Likes */}
//       <span className="font-medium block mb-1">{postLike} likes</span>

//       {/* Caption */}
//       <p className="text-sm mb-1">
//         <span className="font-medium mr-2">{post.author?.username}</span>
//         {post.caption}
//       </p>

//       {
//         comment.length > 0 && (
//           <span onClick={() => {
//             dispatch(setSelectedPost(post))
//             setOpen(true);
//           }} className="text-sm text-gray-500 block mb-2 cursor-pointer">View all {comment.length} comments</span>)
//       }

//       <CommentDialog open={open} setOpen={setOpen} />

//       {/* Add comment */}
//       <div className="flex items-center gap-2">
//         <input
//           placeholder="Add a comment..."
//           className="outline-none text-sm w-full" value={text} onChange={changeEventHandler}
//         />
//         {text && <button onClick={commentHandler} className="text-[#3BADF8] font-medium text-sm cursor-pointer">
//           Post
//         </button>}
//       </div>

//     </div >
//   )
// }

// export default Post

import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice.js";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const dispatch = useDispatch();

  const [liked, setLiked] = useState(post?.likes?.includes(user?._id));
  const [postLike, setPostLike] = useState(post?.likes?.length || 0);
  const [comment, setComment] = useState(post?.comments || []);

  // ---------------- LIKE HANDLER ----------------
  const likeOrDisLikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";

      const res = await axios.get(
        `http://localhost:3000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setLiked(!liked);
        setPostLike(liked ? postLike - 1 : postLike + 1);

        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            }
            : p
        );

        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- COMMENT HANDLER ----------------
  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/post/${post._id}/comment`,
        { text },
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedComments = [...comment, res.data.comment];
        setComment(updatedComments);

        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComments } : p
        );

        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
        setText("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- DELETE POST ----------------
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPosts = posts.filter((p) => p._id !== post._id);
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- BOOKMARK ----------------
  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= UI =================
  return (
    <div className="my-8 w-full max-w-sm mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post?.author?.profileImage} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2">
            <h1 className="text-sm font-medium">{post?.author?.username}</h1>
            {user?._id === post?.author?._id && <Badge>Author</Badge>}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>

          <DialogContent>
            {post?.author?._id !== user?._id && <Button variant="ghost">Unfollow</Button>}
            {user?._id === post?.author?._id && (
              <Button onClick={deletePostHandler} className="text-red-500">Delete</Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* IMAGE */}
      <img
        src={post?.image || "https://via.placeholder.com/400"}
        className="w-full rounded"
      />


      {/* ACTIONS */}
      <div className="flex justify-between my-2">
        <div className="flex gap-3">
          <FaRegHeart
            onClick={likeOrDisLikeHandler}
            className={`cursor-pointer ${liked ? "text-red-600" : ""}`}
            size={22}
          />

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer"
          />

          <Send className="cursor-pointer" />
        </div>

        <Bookmark onClick={bookmarkHandler} className="cursor-pointer" />
      </div>

      {/* LIKES */}
      <p className="font-medium">{postLike} likes</p>

      {/* CAPTION */}
      <p>
        <b>{post?.author?.username}</b> {post?.caption}
      </p>

      {/* COMMENTS */}
      {comment.length > 0 && (
        <p onClick={() => setOpen(true)} className="text-sm text-gray-500 cursor-pointer">
          View all {comment.length} comments
        </p>
      )}

      <CommentDialog open={open} setOpen={setOpen} />

      {/* ADD COMMENT */}
      <div className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full outline-none text-sm"
          placeholder="Add a comment..."
        />
        {text && <button onClick={commentHandler} className="text-blue-500">Post</button>}
      </div>

    </div>
  );
};

export default Post;