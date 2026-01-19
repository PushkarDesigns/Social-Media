import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("");

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    };

    const sendMessageHandler = async () => {
        alert(text);
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl p-0 flex flex-col'>
                <div className="flex flex-1">
                    <div className='w-1/2'>
                        <img src="https://images.unsplash.com/photo-1767992225666-e483dcfba7a4?q=80&w=419&auto=format&fit=crop"
                            alt="post_img" className='w-full h-full object-cover rounded-l-lg'
                        />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className='p-4 flex items-center justify-between'>
                            <div className="flex gap-3 items-center">
                                <Link className='font-semibold trext-sm'>
                                    <Avatar>
                                        <AvatarImage src="" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <Link>username</Link>
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
                        comments ayenge
                    </div>
                    <div className='p-4'>
                        <div className='flex items-center gap-2'>
                            <input type="text" value={text} onChange={changeEventHandler} placeholder='Add a comment...' className='w-full outline-none border border-gray-300 p-2 rounded' />
                            <button onClick={sendMessageHandler} disabled={!text.trim()} varient='outline'>Send</button>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog;
