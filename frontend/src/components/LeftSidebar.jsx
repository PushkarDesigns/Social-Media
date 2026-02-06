// import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from "lucide-react";
// import React from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// const sidebarItems = [
//   { icon: Home, text: "Home" },
//   { icon: Search, text: "Search" },
//   { icon: TrendingUp, text: "Explore" },
//   { icon: MessageCircle, text: "Messages" },
//   { icon: Heart, text: "Notifications" },
//   { icon: PlusSquare, text: "Create" },
//   {
//     icon: (<Avatar>
//       <AvatarImage src="https://github.com/shadcn.png" />
//       <AvatarFallback>CN</AvatarFallback>
//     </Avatar>), text: "Profile"
//   },
//   { icon: <LogOut />, text: "Home" },
// ];

// const LeftSidebar = () => {
//   return (
//     <div className="left-sidebar">
//       {sidebarItems.map((item, index) => {
//         return (
//           <div key={index} className="sidebar-item">
//             {item.icon}
//             <span>{item.text}</span>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default LeftSidebar;

import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { PopoverContent } from "@radix-ui/react-popover";
// import store from "@/redux/store ";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification)
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false)

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/user/logout",
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setAuthUser(null));
        toast.success(res.data.message);
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === 'Logout') {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    }// This line is derived from the image provided by the user
    else if (textType === 'Messages') {
      navigate("/chat");
    }
  }

  const AvatarIcon = () => (
    <Avatar className="w-6 h-6">
      <AvatarImage src={user?.uploadImage} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );

  const sidebarItems = [
    { icon: Home, text: "Home" },
    { icon: Search, text: "Search" },
    { icon: TrendingUp, text: "Explore" },
    { icon: MessageCircle, text: "Messages" },
    { icon: Heart, text: "Notifications" },
    { icon: PlusSquare, text: "Create" },
    { icon: AvatarIcon, text: "Profile" },
    { icon: LogOut, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 left-0 z-10 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold my-4">LOGO</h1>

        <div>
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => sidebarHandler(item.text)}
                className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer p-2 rounded"
              >
                <Icon />
                <span>{item.text}</span>
                {
                  item.text === "Notifications" && likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        {/* Trigger button for the popover, styled as a small icon badge */}
                        <Button size="icon" className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent>
                        <div>
                          {/* Conditional rendering: show empty state or map through notifications */}
                          {likeNotification.length === 0 ? (
                            <p>No new notification</p>
                          ) : (
                            likeNotification.map((notification) => (
                              <div key={notification.userId} className="flex items-center gap-2 my-2">
                                {/* Additional notification details would go here */}
                                <div className="flex items-center gap-3 p-3 border-b">
                                  <Avatar>
                                    {/* Typo Fix: Changed "profilePicutre" to "profilePicture" */}
                                    <AvatarImage src={notification.userDetails?.profilePicture} alt="Profile Picture" />
                                    <AvatarFallback>{notification.userDetails?.username?.charAt(0)}CN</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className='text-sm'>
                                      <span className="font-bold">{notification.userDetails?.username}</span> liked your post
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )

                }
                <Popover />
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;

