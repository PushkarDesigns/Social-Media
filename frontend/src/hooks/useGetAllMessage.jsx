// Import necessary functions and libraries for a React/Redux setup
import { setMessages } from "../redux/chatSlice.js"; // Action to store chat messages
// import { setPosts } from "/redux/postsSlice";   // Action to store posts
import axios from "axios";                      // HTTP client for API requests
import { useEffect } from "react";              // Hook for handling side effects
import { useDispatch, useSelector } from "react-redux"; // Hooks for Redux integration

// Define a custom React hook named 'useGetAllMessage'
const useGetAllMessage = () => {
  // Initialize the dispatch function to send actions to the Redux store
  const dispatch = useDispatch();

  // Select the 'selectedUser' from the Redux store's authentication state
  const { selectedUser } = useSelector((store) => store.auth);

  // Use useEffect to perform the data fetching operation
  useEffect(() => {
    // Define an asynchronous function to fetch all messages
    const fetchAllMessage = async () => {
      try {
        // Make a GET request to the specified API endpoint
        // The URL includes the ID of the selected user for targeted fetching
        const res = await axios.get(
          `http://localhost:3000/api/v1/message/all/${selectedUser?.id}`,
          {
            withCredentials: true, // Ensures cookies (like authentication tokens) are sent with the request
          }
        );
        console.log(res);

        // Check if the request was successful based on the API's response structure
        if (res.data.success) {
          // If successful, dispatch the fetched messages to the Redux store using the setMessages action
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        // If an error occurs during the fetch (network issue, API error, etc.), log it to the console
        console.log(error);
      }
    };

    // Call the asynchronous fetch function to initiate the data retrieval
    fetchAllMessage();
    // The dependency array is missing here in the image, which means the effect might run every re-render.
    // A dependency on 'selectedUser?.id' would likely be appropriate.
  },[selectedUser]);

  // Custom hooks typically return values or functions, though this one only performs a side effect via dispatch.
};

// Export the custom hook so it can be imported and used in other components
export default useGetAllMessage;
