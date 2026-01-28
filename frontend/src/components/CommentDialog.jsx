import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment.jsx'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("");
    const { selectedPost, posts } = useSelector(store => store.post);
    const [comment, setComment] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost.comments);
        }
    }, [selectedPost]);


    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    };

    // const sendMessageHandler = async () => {
    //     alert(text);
    // }

    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:3000/api/v1/post/${selectedPost?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(res.data);

            if (res.data.success) {
                const updatedCommentData = [
                    ...comment,
                    res.data.comment
                ];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === selectedPost.id ?
                        {
                            ...p,
                            comments: updatedCommentData
                        } :
                        p
                );

                dispatch(setPosts(updatedPostData));

                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl p-0 flex flex-col'>
                <div className="flex flex-1">
                    <div className='w-1/2'>
                        <img src={selectedPost?.image}
                            alt="post_img" className='w-full h-full object-cover rounded-l-lg'
                        />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className='p-4 flex items-center justify-between'>
                            <div className="flex gap-3 items-center">
                                <Link className='font-semibold trext-sm'>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.uploadImage} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <Link>{selectedPost?.author?.username}</Link>
                                {/* <span className="text-gray-600 text-sm">Bio here...</span> */}
                            </div>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <MoreHorizontal className='cursor-pointer' />
                            </DialogTrigger>
                            <DialogContent className='flex flex-col items-center text-sm text-center'>
                                <div className="cursor-pointer w-full text-[#ED4956] font-bold">unfollow</div>
                                <div className="cursor-pointer w-full">Add to favorites</div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <hr />
                    <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                        {
                            comment.map((comment) => <Comment key={comment._id} comment={comment} />)
                        }

                    </div>
                    <div className='p-4'>
                        <div className='flex items-center gap-2'>
                            <input type="text" value={text} onChange={changeEventHandler} placeholder='Add a comment...' className='w-full text-sm outline-none border border-gray-300 p-2 rounded' />
                            <button onClick={sendMessageHandler} disabled={!text.trim()} varient='outline'>Send</button>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog;

// import React, { useEffect, useState } from 'react'
// import { Dialog, DialogContent } from './ui/dialog'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import { Link } from 'react-router-dom'
// import { MoreHorizontal } from 'lucide-react'
// import { useDispatch, useSelector } from 'react-redux'
// import Comment from './Comment.jsx'
// import axios from 'axios'
// import { toast } from 'sonner'
// import { setPosts } from '@/redux/postSlice'

// const CommentDialog = ({ open, setOpen }) => {
//     const [text, setText] = useState('')
//     const [comments, setComments] = useState([])

//     const { selectedPost, posts } = useSelector(store => store.post)
//     const dispatch = useDispatch()

//     useEffect(() => {
//         if (selectedPost?.comments) {
//             setComments(selectedPost.comments)
//         }
//     }, [selectedPost])

//     const changeEventHandler = (e) => {
//         setText(e.target.value)
//     }

//     const sendMessageHandler = async () => {
//         if (!text.trim()) return

//         try {
//             const res = await axios.post(
//                 `http://localhost:3000/api/v1/post/${selectedPost?._id}/comment`,
//                 { text },
//                 {
//                     headers: { 'Content-Type': 'application/json' },
//                     withCredentials: true
//                 }
//             )

//             if (res.data.success) {
//                 const updatedComments = [...comments, res.data.comment]
//                 setComments(updatedComments)

//                 const updatedPosts = posts.map(post =>
//                     post._id === selectedPost._id
//                         ? { ...post, comments: updatedComments }
//                         : post
//                 )

//                 dispatch(setPosts(updatedPosts))
//                 toast.success(res.data.message)
//                 setText('')
//             }
//         } catch (error) {
//             console.error(error)
//             toast.error('Failed to add comment')
//         }
//     }

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogContent className="max-w-5xl p-0">
//                 <div className="flex h-[600px]">

//                     {/* LEFT : IMAGE */}
//                     <div className="w-1/2">
//                         <img
//                             src={selectedPost?.image}
//                             alt="post"
//                             className="w-full h-full object-cover rounded-l-lg"
//                         />
//                     </div>

//                     {/* RIGHT : CONTENT */}
//                     <div className="w-1/2 flex flex-col">

//                         {/* HEADER */}
//                         <div className="p-4 flex items-center justify-between border-b">
//                             <div className="flex items-center gap-3">
//                                 <Avatar>
//                                     <AvatarImage src={selectedPost?.author?.uploadImage} />
//                                     <AvatarFallback>CN</AvatarFallback>
//                                 </Avatar>
//                                 <Link className="font-semibold text-sm">
//                                     {selectedPost?.author?.username}
//                                 </Link>
//                             </div>

//                             <MoreHorizontal className="cursor-pointer" />
//                         </div>

//                         {/* COMMENTS */}
//                         <div className="flex-1 overflow-y-auto p-4 space-y-3">
//                             {comments.map(comment => (
//                                 <Comment key={comment._id} comment={comment} />
//                             ))}
//                         </div>

//                         {/* INPUT */}
//                         <div className="p-4 border-t">
//                             <div className="flex items-center gap-2">
//                                 <input
//                                     type="text"
//                                     value={text}
//                                     onChange={changeEventHandler}
//                                     placeholder="Add a comment..."
//                                     className="w-full text-sm outline-none border border-gray-300 p-2 rounded"
//                                 />
//                                 <button
//                                     onClick={sendMessageHandler}
//                                     disabled={!text.trim()}
//                                     className="text-sm font-semibold text-blue-500 disabled:opacity-50"
//                                 >
//                                     Send
//                                 </button>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default CommentDialog
