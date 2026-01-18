import React from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Links } from 'react-router-dom'

const CommentDialog = ({ open, setOpen }) => {
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
                        <div className='flex items-center justify-between'>
                            <Links>
                                <Avatar>
                                    <AvatarImage src="" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Links>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog;
