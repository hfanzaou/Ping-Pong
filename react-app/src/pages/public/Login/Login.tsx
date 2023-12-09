import React, { useState, useEffect } from 'react';
// import React, { useEffect } from 'react';
import axios from 'axios'
// import Button from '@mui/material/Button'
import './Login.css'
import PropTypes from 'prop-types';

import Cookies from 'js-cookie';



async function loginUser() {
  try { /// convert to use axios just neeed to fix it 
    const response = await fetch('http://localhost:3000/login', {
      method: 'GET',
      mode: "no-cors",
    });

    console.log(response);
    
    if (!response.ok) {
        // window.location.href = "https://api.intra.42.fr/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&client_id=u-s4t2ud-e7de58c8eeee4dc0d152d9266d707f16a7f45efa7952bc889d340369ecead92c";
        // window.location.href = "http://localhost:3000/login";
      
        // await window.location.replace(response.Location);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);


    return data.token; // Assuming the token is in the response
  // return;
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Login failed'); // Rethrow the error for the caller to handle
  }
}


// interface LoginProps {
//   setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
// }

// interface LoginProps {
//   setToken: (userToken: string | '') => void; // Adjust the type as needed
// }

// const Login: React.FC<LoginProps> = ({ setToken}) => {
function Login() {

  const handleClick = async () => {


    // set cookies for dev mode
    // Cookies.set("jwt", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJJRCI6MSwiaWF0IjoxNzAxNTUzNTkxfQ.1vBFZhqlWwKkEadFEOLnC90torC3S87XRM2VtGzROzE");
    // window.location.href = "http://localhost:3001/";
   

    // Just redirect to backend /auth
    console.log('in login');
    window.location.href = "http://localhost:3001/login";
   
   

    // try {
    //   const token = await loginUser();
    //   // setToken(token);
    // } catch (error) {
    //   // Handle the error (e.g., show an error message to the user)
    //   console.error('Login failed:', error);
    // }
  };

  return (
    <div className='h-screen flex items-center justify-center'>
      <h1 className="text-1xl font-bold text-blue-50">
        Login with 42 intranet to Play Pong game with others
      </h1>
      <button className="bg-sky-500" onClick={handleClick}>
        Play game
      </button>
    </div>
  );
}

// Login.propTypes = {
//     setToken: PropTypes.func.isRequired
//   };

export default Login
