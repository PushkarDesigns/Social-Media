import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Custom hook to handle real-time message updates via Socket.IO
const useGetRTM = () => {
  // Get the dispatch function from Redux
  const dispatch = useDispatch();
  // Select the socket and messages from the Redux store state
  const socket = useSelector((store) => store.socketio);
  const messages = useSelector((store) => store.chat);

  // useEffect hook runs when the component mounts or dependencies change
  useEffect(() => {
    // Listen for a 'newMessage' event from the socket
    socket?.on("newMessage", (newMessage) => {
      // Dispatch an action to update the Redux store with the new message
      dispatch(setMessages([...messages, newMessage]));
    });

    // Cleanup function to unsubscribe from the event when the component unmounts
    return () => {
      socket?.off("newMessage");
    };
  }, [messages, setMessages]); // Dependencies array: reruns effect if messages or setMessages changes

  // The hook does not return a value, it only manages side effects
};

export default useGetRTM; // Export the custom hook for use in other components
