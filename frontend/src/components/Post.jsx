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
import { setPosts } from '@/redux/postSlice'

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store=>store.post);
  const dispatch = useDispatch();
 
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/v1/post/delete/${post._id}`,{withCredentials:true})
      if(res.data.success){
        const updatePostData = post.filter((postItem)=> postItem?._id !== post?._id);
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
          <h1 className="text-sm font-medium">{post.author?.username}</h1>
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
          <FaRegHeart size={22} className="cursor-pointer hover:text-gray-600" />
          <MessageCircle onClick={() => setOpen(true)} className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>

      {/* Likes */}
      <span className="font-medium block mb-1">{post.likes.length} likes</span>

      {/* Caption */}
      <p className="text-sm mb-1">
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>

      {/* Comments */}
      <span onClick={() => setOpen(true)} className="text-sm text-gray-500 block mb-2 cursor-pointer">
        View all 10 comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} />

      {/* Add comment */}
      <div className="flex items-center gap-2">
        <input
          placeholder="Add a comment..."
          className="outline-none text-sm w-full" value={text} onChange={changeEventHandler}
        />
        {text && <button className="text-[#3BADF8] font-medium text-sm">
          Post
        </button>}
      </div>

    </div>
  )
}

export default Post