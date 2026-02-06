// Import necessary hooks from React, React-Redux, and React Router DOM
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Define the ProtectedRoutes functional component, which accepts 'children' as a prop
const ProtectedRoutes = ({ children }) => {
  // Use the useSelector hook to extract the 'user' state from the Redux store's 'auth' slice
  const { user } = useSelector(store => store.auth);
  // Initialize the navigate function from useNavigate hook to programmatically change routes
  const navigate = useNavigate();

  // Use the useEffect hook to perform side effects (checking authentication status) after rendering
  useEffect(() => {
    // Check if the 'user' object is null or undefined (meaning the user is not authenticated)
    if (!user) {
      // If not authenticated, redirect the user to the '/login' route
      navigate("/login");
    }
  }, [user, navigate]); // Dependencies array: the effect runs whenever 'user' or 'navigate' changes

  // Return the 'children' components if the user is authenticated (they remain on the current page)
  return <>{children}</>;
};

// Export the component as the default export for use in other files
export default ProtectedRoutes;
