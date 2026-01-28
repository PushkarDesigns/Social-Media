import React, { useState } from 'react'
import { FaRegHeart } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice.js'
import { Badge } from './ui/badge'

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id || false));
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }

  const likeOrDisLikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`http://localhost:3000/api/v1/post/${post._Id}/${action}`, { withCredentials: true });
      if (res.data.messsage) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        // update post for update screen
        const updatedPostData = posts.map(sp =>
          sp._id === post._id ?
            {
              ...sp,
              likes: liked ? sp.likes.filter((id) => id !== user._id) : [...sp.likes, user._id]
            } : sp
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.messsage);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const commentHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/post/${post._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log(res.data);

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(spc =>
          spc._id === post._id ?
            {
              ...spc,
              comments: updatedCommentData
            } : spc
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }


  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/v1/post/delete/${post._id}`, { withCredentials: true })
      if (res.data.success) {
        const updatePostData = post.filter((postItem) => postItem?._id !== post?._id);
        dispatch(setPosts(updatePostData));
        toast.success(res.data.messsage);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.messsage);
    }
  }


  return (
    <div className="my-8 w-full max-w-sm mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profileImage} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-medium">{post.author?.username}</h1>
            {user?._id === post.author._id &&
              <Badge variant="secondary">Author</Badge>}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button variant="ghost" className="text-[#ED4956] font-bold">
              Unfollow
            </Button>
            <Button variant="ghost">Add to favorites</Button>
            {
              user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant="ghost" className="text-[#ED4956] font-bold">Delete</Button>
            }
          </DialogContent>
        </Dialog>
      </div>

      {/* Image */}
      <img
        className="rounded-sm w-full aspect-square object-cover"
        src={post.image}
        alt="post_img"
      />

      {/* Actions */}
      <div className="flex items-center justify-between my-3">
        <div className="flex items-center gap-3">
          {
            liked ? <FaRegHeart onClick={likeOrDisLikeHandler} size={'24'} className="cursor-pointer text-red-600" /> : <FaRegHeart onClick={likeOrDisLikeHandler} size={'22px'} className="cursor-pointer hover:text-gray-600" />
          }
          <MessageCircle onClick={() => {
            dispatch(setSelectedPost(post))
            setOpen(true);
          }} className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>

      {/* Likes */}
      <span className="font-medium block mb-1">{postLike} likes</span>

      {/* Caption */}
      <p className="text-sm mb-1">
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>

      {
        comment.length > 0 && (
          <span onClick={() => {
            dispatch(setSelectedPost(post))
            setOpen(true);
          }} className="text-sm text-gray-500 block mb-2 cursor-pointer">View all {comment.length} comments</span>)
      }

      <CommentDialog open={open} setOpen={setOpen} />

      {/* Add comment */}
      <div className="flex items-center gap-2">
        <input
          placeholder="Add a comment..."
          className="outline-none text-sm w-full" value={text} onChange={changeEventHandler}
        />
        {text && <button onClick={commentHandler} className="text-[#3BADF8] font-medium text-sm cursor-pointer">
          Post
        </button>}
      </div>

    </div >
  )
}

export default Post