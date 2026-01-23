// // Import the main React library
// import React, { useRef, useState } from 'react';
// // Import the specific Dialog components from a local library
// import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// import { Textarea } from './ui/textarea';
// import { Button } from './ui/button';
// import { readFileAsDataURL } from '@/lib/utils';
// import { Loader2 } from 'lucide-react';
// import { toast } from 'sonner';
// import axios from 'axios';

// // Define the main CreatePost component which controls a pop-up window
// const CreatePost = ({ open, setOpen }) => {
//   // const createPostHandler = async (e) => { // This part was commented out in the image
//   // e.preventDefault(); |
//   const imageRef = useRef();
//   const [file, setFile] = useState('');
//   const [caption, setCaption] = useState('');
//   const [imagePreview, setImagePreview] = useState('');
//   const [loading, setLoading] = useState(false);

//   const fileChangeHandler = async (e) => {
//     const file = e.target.file?.[0];
//     if (file) {
//       setFile(file);
//       const dataUrl = await readFileAsDataURL(file);
//       setImagePreview(dataUrl);
//     }
//   }

//   // Function to handle what happens when the user submits the form
//   const createPostHandler = async (e) => {
//     // e.preventDefault(); // Stop the webpage from refreshing on form submit
//     const formData = new FormData();
//     formData.append("caption", caption);
//     if (imagePreview) formData.append("image", file);
//     try {
//       // console.log(file,caption); // given out caption and image information (name,size,type, etc)
//       setLoading(true);
//       const res = await axios.post('http://localhost:3000/api/v1/post/addpost', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         },
//         withCredentials: true
//       });
//       if (res.data.success) {
//         toast.success(res.data.message);
//       }
//       // This is where you would put the code to save the new post (e.g., to a database)
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally{
//       setLoading(false);
//     }
//   };

//   // This section defines the visual elements (UI) of the component
//   return (
//     // The main pop-up box, which is shown or hidden using the 'open' setting
//     <Dialog open={open}>
//       {/* // The area inside the pop-up box */}
//       <DialogContent onInteractOutside={() => setOpen(false)}>
//         <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
//         {/* // The form itself, ready to listen for the submit action */}
//         {/* <form onSubmit={createPostHandler}> */}
//         <div className="flex gap-3 items-center">
//           <Avatar>
//             <AvatarImage src='' alt='img'>
//               <AvatarFallback>CN</AvatarFallback>
//             </AvatarImage>
//           </Avatar>
//           <div className="">
//             <hi classliane="font-semibold text-xs">Username</hi>
//             <span className="font-semibold text-xs"> Bio here...</span>
//           </div>
//         </div>
//         {/* </form> */}
//         <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />
//         {
//           imagePreview && (
//             <div className='w-full h-64 flex items-center justify-center'>
//               <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
//             </div>
//           )
//         }
//         <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
//         <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#6895F6] hover:bg-[#258bcf]'>Select from computer</Button>
//         {imagePreview && (
//           loading ? (
//             <Button>
//               <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//               Please wait
//             </Button>
//           ) : (
//             <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
//           ))
//         }
//       </DialogContent>
//     </Dialog>
//   );
// };

// // Make this component available to other parts of your application
// export default CreatePost;

// Import the main React library
import React, { useRef, useState } from "react";

// Import UI components
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { Textarea } from "./ui/textarea.jsx";
import { Button } from "./ui/button.jsx";

import { readFileAsDataURL } from "@/lib/utils.js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice.js";
// import Posts from "./Posts";


const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef(null);

  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const { posts } = useSelector(store=>store.post)
  const dispatch = useDispatch();

  // Handle image selection
  const fileChangeHandler = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const dataUrl = await readFileAsDataURL(selectedFile);
    setImagePreview(dataUrl);
  };

  // Handle post creation
  const createPostHandler = async () => {
    if (!caption && !file) {
      toast.error("Post cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("image", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/v1/post/addpost",
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([...posts, res.data.post]))
        toast.success(res.data.message);

        // Reset state
        setCaption("");
        setFile(null);
        setImagePreview("");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>

        {/* User Info */}
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.uploadImage} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-xs">{user?.username}</p>
            <span className="text-xs text-gray-500">Bio here...</span>
          </div>
        </div>

        {/* Caption */}
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="preview"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={fileChangeHandler}
        />

        {/* Select Image Button */}
        <Button
          type="button"
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#6895F6] hover:bg-[#258bcf]"
          disabled={loading}
        >
          Select from computer
        </Button>

        {/* Post Button */}
        {imagePreview && (
          loading ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button onClick={createPostHandler} className="w-full">
              Post
            </Button>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
