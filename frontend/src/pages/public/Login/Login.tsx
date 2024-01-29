import React from 'react';
import { Button } from '@mantine/core';


function Login() {

    const handleClick = async () => {
        // Just redirect to backend /auth
        window.location.href = `login`;
    };

    return (
    // <div className='h-screen flex items-center justify-center'>
    //   <h1 className="text-1xl font-bold text-blue-50">
    //     Login with 42 intranet to Play Pong game with others
    //   </h1>
      <Button size='sm' color='green' radius='lg' onClick={handleClick}>
        login whith
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"  className='h-[25px] w-[30px] ml-3 bg-green-100 rounded-md' alt="42_logo" />
      </Button>
    // </div>
  );
}

export default Login
