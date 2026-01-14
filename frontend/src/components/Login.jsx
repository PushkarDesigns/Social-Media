import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'

const Login = () => {
    const [input, setInput] = useState({
        email:'',
        password:''
    })
    const [loading, setLoading] = useState(false);
    const changeEventHandler = (e) =>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const signUpHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
        const res = await axios.post(
            'http://localhost:3000/api/v1/user/login',
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
            toast.success(res.data.message);
            setInput({
                email:'',
                password:''
            })
        }
    } catch (error) {
        console.log(error.response);
        toast.error(error.response?.data?.message || "Login failed");
    } finally{
        setLoading(false)
    }
};

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signUpHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1>LOGO</h1>
                    <p>Login to see photos & videos from your friends</p>
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
                <Button type='submit'>Login</Button>
            </form>

        </div>
    )
}

export default Login
