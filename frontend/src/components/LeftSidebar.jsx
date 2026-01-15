import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const sidebarItems = [
  { icon: Home, text: "Home" },
  { icon: Search, text: "Search" },
  { icon: TrendingUp, text: "Explore" },
  { icon: MessageCircle, text: "Messages" },
  { icon: Heart, text: "Notifications" },
  { icon: PlusSquare, text: "Create" },
  {
    icon: (<Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>), text: "Profile"
  },
  { icon: <LogOut />, text: "Home" },
];

const LeftSidebar = () => {
  return (
    <div className="left-sidebar">
      {sidebarItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="sidebar-item">
            <Icon />
            <span>{item.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default LeftSidebar;
