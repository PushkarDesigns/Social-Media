import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const user = useSelector(store => store.auth);
  return (
    <div className="w-fit my-10 pr-32">
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
      </div>

      <div>
        <h1 className='font-semibold text-sm '><Link to={`/profile/${user?.id}`}>{user?.username}</Link></h1>
        <span>{user?.bio || 'Bio here...'}</span>
      </div>
      <SuggestedUsers />
    </div>    
  )
}

export default RightSidebar;