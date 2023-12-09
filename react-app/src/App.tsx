import React, { useEffect, useState } from 'react'
import { Outlet, BrowserRouter as Router} from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'

import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'

import Cookies from 'js-cookie'
import './index.css'

import Login from './pages/public/Login/Login'
import Header from './Layout/Header/Header'
import Footer from './Layout/Footer/Footer'
import  Home from './pages/private/Home/Home'
import Profile from './pages/private/Profile/Profile'
import EditeProfile from './pages/private/Settings/FditeProfile/EditeProfail'
import EnableTowFactor from './pages/private/Settings/EnableTowFactor'
import Game from './pages/private/Game/Game'
import Chat from './pages/private/Chat/Chat'

import useToken from './pages/public/Login/useToken'
import axios from 'axios'
import { withCookies } from 'react-cookie'

function Verify()
{
  const [isVerified, setIsVerified] = useState(false);
    useEffect(() => {
    axios.get("http://localhost:3001/verify", { withCredentials: true })
    .then((res) => {
        console.log(res.status);
        setIsVerified(res.status === 200);
    })
    .catch((err) => {
      console.log('here');
      setIsVerified(false);
      //window.location.href = 'http://localhost:3000';
    }), []})
    return isVerified;
}

function App()  {
  // const { token, setToken } = useToken();
  // if (!token) {
  //   return (
  //     <Login setToken={setToken} />
  //   );
  // }

  // const SetCookie = () => {
    // Cookies.set("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
      // expires: 7,
    // });
  // };

  // Method to get data from cookies
  // const GetCookie = () => {
    // alert(Cookies.get("token"));
  // };
  const isVerified = Verify();
  if (isVerified === false) {
    // Verification is still in progress
    return <Login />;
  }

  return (
    isVerified ? (
      <MantineProvider>
        <Router>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Profile' element={<Profile />} />
            <Route path='/Game' element={<Game />} />
            <Route path='/Chat' element={<Chat />} />
            <Route path='/setting' element={<EditeProfile />} />
          </Routes>
        </Router>
      </MantineProvider>
    ) : (
      <Login />
    )
  );
}

  // if (Verify() == 0) {
  //   return (
  //     <Login />
  //   );
  // }
  // return (
  //   <MantineProvider>
  //   <Router>
  //     <Header/>
  //     <Routes>
  //         <Route path='/' element={<Home />}/>
  //         <Route path='/Profile' element={<Profile />}/>
  //         <Route path='/Game' element={<Game />}/>
  //         <Route path='/Chat' element={<Chat />}/>
  //         <Route path='/setting' element={<EditeProfile />}/>
  //         {/* <Route path='/settings/enable/2f' element={<EnableTowFactor />}/> */}
  //     </Routes>
  //     {/* <Footer/> */}
  //     </Router>
  //   </MantineProvider>
  // );
// }

export default App