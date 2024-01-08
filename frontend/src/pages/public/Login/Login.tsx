import React, { useEffect, useState } from 'react';
import './Login.css'
import axios from 'axios';
import { Button } from '@mantine/core';


function Login() {

  const handleClick = async () => {

    // Just redirect to backend /auth
    // window.location.href = "http://localhost:3001/login";
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}login`;


    // set cookies for dev mode
    // Cookies.set("jwt", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJJRCI6MSwiaWF0IjoxNzAxNTUzNTkxfQ.1vBFZhqlWwKkEadFEOLnC90torC3S87XRM2VtGzROzE");
    // window.location.href = "http://localhost:3000/";
  };

  return (
    // <div className='h-screen flex items-center justify-center'>
    //   <h1 className="text-1xl font-bold text-blue-50">
    //     Login with 42 intranet to Play Pong game with others
    //   </h1>
      <Button className="bg-gray-500 rounded-full" color='gray' m={5} radius='xl' onClick={handleClick}>
        login whith 42
      </Button>
    // </div>
  );
}

export default Login
