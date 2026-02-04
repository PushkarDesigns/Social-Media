// Import the createSlice function from the Redux Toolkit library
import { createSlice } from "@reduxjs/toolkit";

// Create a 'slice' of the Redux store state
const rtnSlice = createSlice({
  // Name of the slice, used as a prefix for action types
  name: 'realTimeNotification',
  
  // The initial state of this part of the store
  initialState: {
    LikeNotification: [], // An array to store like notifications
  },
  
  // Reducers define how the state can be updated
  reducers: {
    // This is an action creator function
    setLikeNotification: (state, action) => {
      // Check if the payload of the action is the string 'like'
      if (action.payload === 'like') {
        // A complete line of logic would go here to modify the state, 
        // e.g., state.LikeNotification.push(action.payload);
      }
      // The rest of the logic for this reducer is cut off in the image
    },
  },
});
