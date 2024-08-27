import { Button, TextInput } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);

    const handleChange = (e) => {

    }


  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-3xl text-center my-6 font-extrabold underline text-blue-950 dark:text-slate-300">
        Profile
      </h1>
      <form className='flex flex-col gap-4'>
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange}/>
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange}/>
        <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
        <Button type='submit' gradientDuoTone='purpleToBlue' className="uppercase" >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
}
