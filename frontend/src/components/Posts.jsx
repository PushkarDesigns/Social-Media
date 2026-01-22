// Import the core React library
import React from 'react';
// Import the 'Post' component from a local file
import Post from './Post';
// Import the 'useSelector' hook from react-redux to access the Redux store state
import { useSelector } from 'react-redux';

// Define the functional 'Posts' component
const Posts = () => {
  // Use useSelector to extract the 'posts' array from the global Redux store's 'post' slice
  const { posts } = useSelector(store => store.post);

  // The component returns JSX (UI elements)
  return (
    <div>
      {/* Iterate over the 'posts' array and render a 'Post' component for each item */}
      {/* 'key' is required by React for lists, and 'post' passes the data to the child component */}
      {posts.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
};

// Export the 'Posts' component so it can be used elsewhere in the application
export default Posts;

