import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: 'realTimeNotification',
  initialState: {
    likeNotification: [], // Stores notification objects
  },
  reducers: {
    setLikeNotification: (state, action) => {
      // If the type is 'Like', add the new notification to the array
      if (action.payload.type === 'Like') {
        state.likeNotification.push(action.payload);
      } 
      // If the type is 'dislike', remove the notification for that specific user
      else if (action.payload.type === 'dislike') {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
  },
});

// Export the action for use in your components
export const { setLikeNotification } = rtnSlice.actions;

// Export the reducer to be included in the store
export default rtnSlice.reducer;
