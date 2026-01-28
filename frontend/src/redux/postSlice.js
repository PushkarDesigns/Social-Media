 // Import the necessary function 'createSlice' from the Redux Toolkit library
import { createSlice } from "@reduxjs/toolkit";

// Call createSlice to set up a 'slice' of the Redux store state
const postSlice = createSlice({
  // Name for this part of the state
  name: 'post',
  // Initial values for the state when the app starts
  initialState: {
    posts: [], // An empty array to hold post data
    selectedPost:null,
  },
  // Reducers define how the state can be changed (the "actions")
  reducers: {
    // A function (action) named 'setPosts' that updates the state
    setPosts: (state, action) => {
      // It takes the current state and updates the 'posts' array with the data provided in the action payload
      state.posts = action.payload;
    },
    setSelectedPost: (state, action) => { state.selectedPost = action.payload; }
  },
});

// Export the specific action creator for 'setPosts' so components can dispatch it
export const { setPosts, setSelectedPost } = postSlice.actions;

// Export the main reducer function to be added to the Redux store configuration
export default postSlice.reducer;
