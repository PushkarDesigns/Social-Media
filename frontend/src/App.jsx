// import React from 'react'
// import SignUp from './components/Signup'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Login from './components/Login';
// import MainLayout from './components/MainLayout';
// import Home from './components/Home';
// import Profile from './components/Profile';

// const browserRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainLayout />,
//     children: [
//       {
//         index: true,
//         element: <Home />,
//       },
//       {
//         path: "profile",
//         element: <Profile />,
//       },
//     ],
//   },
//   {
//     path: "login",
//     element: <Login />,
//   },
//   {
//     path: "signup",
//     element: <SignUp />,
//   },
// ]);



// const App = () => {
//   return (
//     <>
//     <RouterProvider router={browserRouter}>
//       <SignUp />
//     </RouterProvider>
//     </>
//   )
// }

// export default App

import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element:<ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { index: true, element: <Home /> },
      { path: "/profile/:id", element: <Profile /> },
      { path: "/account/edit", element: <EditProfile /> },
      { path: "/chat", element: <ChatPage /> },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "signup", element: <SignUp /> },
]);

const App = () => {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:3000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      // Dispatch socket instance to Redux store
      dispatch(setSocket(socketio));

      // Listen for the event that provides online users
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      // Listen for a custom event named 'notification' from the connected socket
      socketio.on('notification', (notification) => {
        // When a notification is received, dispatch an action (likely to a Redux store)
        // to update the application's state or trigger a side effect.
        dispatch(setLikeNotification(notification));
      });

      // Cleanup function when component unmounts or dependencies change
      return () => {
        socketio.disconnect();
        dispatch(setSocket(null));
      };
    }
    else
      // This part implements the logic from the image
      if (socket) {
        socket?.close();
        dispatch(setSocket(null));
      }
  }, [user, dispatch]); // Dependency array: run effect when 'user' changes

  return <RouterProvider router={router} />;
};

export default App;
