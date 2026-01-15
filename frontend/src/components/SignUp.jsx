import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const SignUp = () => {
    const [input, setInput] = useState({
        username:'',
        email:'',
        password:''
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const changeEventHandler = (e) =>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const signUpHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
        const res = await axios.post(
            'http://localhost:3000/api/v1/user/register',
            input,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
        console.log(res.data);
        if (res.data.success) {
            navigate('/')
            toast.success(res.data.message);
            setInput({
                username:'',
                email:'',
                password:''
            })
        }
    } catch (error) {
        console.log(error.response);
        toast.error(error.response?.data?.message || "Signup failed");
    } finally{
        setLoading(false)
    }
};

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signUpHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1>LOGO</h1>
                    <p>Signup to see photos & videos from your friends</p>
                </div>
                <div>
                    <Label className="font-medium">Username</Label>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <Label className="font-medium">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <Label className="font-medium">password</Label>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                {
                    loading ? (
                        <Button><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</Button>) : (
                        <Button type='submit'>Signup</Button>)
                }
                <span className="text-center">Already hava a account?<Link to='/login' className='text-blue-600'>Login</Link></span>
            </form>

        </div>
    )
}

export default SignUp

// import React from "react";
// import { Label } from "./ui/label";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";

// const SignUp = () => {
//   return (
//     <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      
//       <form className="w-full sm:max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-4">
        
//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
//             LOGO
//           </h1>
//           <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
//             Sign up to see photos & videos from your friends
//           </p>
//         </div>

//         {/* Username */}
//         <div>
//           <Label className="text-sm font-medium text-gray-700">
//             Username
//           </Label>
//           <Input
//             type="text"
//             placeholder="Enter username"
//             className="mt-1 rounded-xl focus:ring-2 focus:ring-pink-500"
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <Label className="text-sm font-medium text-gray-700">
//             Email
//           </Label>
//           <Input
//             type="email"
//             placeholder="Enter email"
//             className="mt-1 rounded-xl focus:ring-2 focus:ring-pink-500"
//           />
//         </div>

//         {/* Password */}
//         <div>
//           <Label className="text-sm font-medium text-gray-700">
//             Password
//           </Label>
//           <Input
//             type="password"
//             placeholder="Create password"
//             className="mt-1 rounded-xl focus:ring-2 focus:ring-pink-500"
//           />
//         </div>

//         {/* Button */}
//         <Button className="mt-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 sm:py-3 hover:opacity-90 transition">
//           Sign Up
//         </Button>

//         {/* Footer */}
//         <p className="text-center text-xs sm:text-sm text-gray-600 mt-1">
//           Already have an account?{" "}
//           <span className="text-pink-600 font-medium cursor-pointer hover:underline">
//             Login
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default SignUp;
