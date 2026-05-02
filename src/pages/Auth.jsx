import React, { useState } from 'react'
import { useUserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const { user, pushUser } = useUserContext();
    const [name, setName] = useState("")
  
    const navigate = useNavigate();

    const handleOnClick = ()=>{
        console.log(name);
        pushUser(name);
        navigate("/profiles");
    };

    return (
        <main className='w-screen h-screen bg-zinc-900'>
            <container className='p-8 bg-zinc-700 flex items-center flex-col justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-4'>
                <h1 className='text-white text-2xl'>Enter Your name to continue</h1>

                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Your Name' className='w-full bg-zinc-200 text-zinc-900 placeholder:text-zinc-500 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 p-4 rounded-md' />

                <button onClick={handleOnClick} className='bg-zinc-200 w-full p-2 text-xl hover:bg-zinc-300 transition-colors duration-200'>continue</button>
            </container>
        </main>
  )
}

export default Auth