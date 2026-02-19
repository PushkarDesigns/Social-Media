import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setselectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { MessageCircleCode } from 'lucide-react';
import Message from './Message';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const [textMessage, setTextMessage] = useState("");
    const { onlineUsers, messages } = useSelector(store => store.chat);
    // const isOnline = false;
    const dispatch = useDispatch();

    // Define an asynchronous function named 'sendMessageHandler' that takes a 'receiverId' as an argument.
    const sendMessageHandler = async (receiverId) => {
        // Use a try-catch block to handle potential errors during the asynchronous operation.
        try {
            // Send a POST request using Axios to the specified local API endpoint.
            // The message content (textMessage) is sent in the body of the request.
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
                // Define headers for the request.
                headers: {
                    // Specify that the content type is JSON.
                    'Content-Type': 'application/json'
                },
                // Include credentials (like cookies) with the request.
                withCredentials: true
            });

            // Check if the response data indicates success.
            if (res.data.success) {
                // Add code here to handle a successful message send, e.g., clear the input field or show a confirmation.
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage('');
            }
        } catch (error) {
            // If an error occurs (e.g., network issue, API error), log the error to the console.
            console.log(error);
        }
    };
    // This block contains React code, likely using Redux or a similar state management library.

    // The useEffect hook is used to handle side effects in functional components.
    // The provided function runs when the component mounts or updates (depending on the dependency array).
    useEffect(() => {
        // The 'return' statement defines a 'cleanup' function.
        // This function runs just before the component unmounts, or before the effect re-runs.
        return () => {
            // 'dispatch' is likely a function from Redux (useDispatch hook).
            // It's used to send an action to the store to update the application state.
            // The 'setSelectedUser(null)' action clears the currently selected user when the cleanup occurs.
            dispatch(setselectedUser(null));
        };
    }); // Note: A second argument (dependency array) is typically provided to control when this effect runs.


    return (
        <div className='flex ml-[16%] h-screen'>
            <section className='w-full md:w-1/4 my-8'>
                <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUsers.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser?._id);
                            return (
                                <div onClick={() => dispactch(setselectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                                    <Avatar className='w-14 h-14'>
                                        <AvatarImage src={suggestedUser?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{suggestedUser?.username}</span>
                                        <span className='font-medium'>{suggestedUser?.username}</span>
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                                            {isOnline ? 'online' : 'offline'}
                                        </span>

                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
            {
                selectedUser ? (
                    <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                        <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>
                        {/* messages ayenge */}
                        <Message selectedUser={selectedUser} />
                        <div className='flex items-center p-4 border-t border-t-gray-300'>
                            <Input value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)} type="text" className='flex-1 mr-2 focus-visible:ring-transparent' placeholder="Messages..." />
                            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                        </div>
                    </section>
                ) : (
                    <div className="flex flex-col items-center justify-center mx-auto">
                        <MessageCircleCode className="w-32 h-32 my-4" />
                        <h1 className="font-medium text-xl">Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    )
}

export default ChatPage;