// Import the action creator 'setPosts' from the Redux post slice definition
import { setUserProfile } from "../redux/authSlice.js";
import { setPosts } from "@/redux/postSlice";
// Import the Axios library for making HTTP requests
import axios from "axios";
// Import the useEffect hook from React for side effects
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Define a custom hook named 'useGetAllPost' (note the typo in the image, should likely be 'useGetAllPosts')
const useGetUserProfile = (userId) => {
  const dispatch = useDispatch(); // This line is likely missing or implied
  useEffect(() => {
    // Define an asynchronous function to fetch all posts
    const fetchUserProfile = async () => {
      try {
        // Make a GET request to the specified local API endpoint
        const res = await axios.get(`http://localhost:3000/api/v1/user/${userId}/profile`, { withCredentials: true });
        if (res.data.success) {
          // Log the successful response data to the console
          console.log(res.data); // given the post data in object
          dispatch(setUserProfile(res.data.user)); // This line is commented out in the image
        }
      } catch (error) {
        // Log any errors that occur during the fetch operation
        console.log(error);
      }
    };
    // Immediately call the function to fetch all posts when the component mounts
    fetchUserProfile();
  }, [userId]); // The empty dependency array ensures this runs only once

  // The hook does not return anything in the provided code snippet
};

// Export the custom hook for use in other parts of the application
export default useGetUserProfile;