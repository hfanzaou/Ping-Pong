import React from 'react';
import { Button } from '@mantine/core';

function LoginWithIntra() {

    const handleClick = async () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}login`;
    };

    return (
      <Button size='sm' color='green' radius='lg' onClick={handleClick}>
            login with
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"  className='h-[25px] w-[30px] ml-3 bg-green-100 rounded-md' alt="42_logo" />
      </Button>
  );
}

export default LoginWithIntra
