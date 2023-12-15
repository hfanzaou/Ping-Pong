import React from 'react';
import './Login.css'

function Login() {

  const handleClick = async () => {

    // set cookies for dev mode
    // Cookies.set("jwt", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJJRCI6MSwiaWF0IjoxNzAxNTUzNTkxfQ.1vBFZhqlWwKkEadFEOLnC90torC3S87XRM2VtGzROzE");
    // window.location.href = "http://localhost:3000/";
   

    // Just redirect to backend /auth
    window.location.href = "http://localhost:3001/login";
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

export default Login
