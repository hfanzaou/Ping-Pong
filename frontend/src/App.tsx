import React, { useEffect, useState } from 'react'
import { Link, BrowserRouter as Router} from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import { Outlet, Navigate } from 'react-router-dom'

import { LoadingOverlay, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'

import Cookies from 'js-cookie'
import './index.css'

import Login from './pages/public/Login/Login'
import Header from './Layout/Header/Header'
import Footer from './Layout/Footer/Footer'
import  Home from './pages/private/Home/Home'
import Leaderbord from './pages/private/Dashbord/Leaderbord'
import Profile from './pages/private/Profile/Profile'
import EditeProfile from './pages/private/Settings/FditeProfile/EditeProfail'
import EnableTowFactor from './pages/private/Settings/EnableTowFactor'
import Game from './pages/private/Game/Game'
import Chat from './pages/private/Chat/Chat'

import axios from 'axios'
import Auth from './pages/public/Auth'
import CreatProfile from './pages/private/CreatProfile/CreatProfile'
import { useDisclosure } from '@mantine/hooks'

function App()  {
    const [avatar, setAvatar] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [hasToken, setHasToken] = useState<Boolean>(false);
    const [has2fa, setHas2fa] = useState<boolean>(false);


// comonentDidMount

  axios.defaults.withCredentials = true;  // to send token in every requiste
  
    const getVerify = async () => {
      try {
        const res = await axios.get('http://localhost:3001/verify');
        if (res.status === 200) {
          setHasToken(true);
        } else
            setIsLoading(false);
        // setHasToken(res.status === 200);
      } catch {
        console.log("error in fetching /verify");
      }
    }
    getVerify();

    const getFirstVerify = async () => {
      try {
        const res = await axios.get('http://localhost:3001/verifyTfa');
        if (res.status === 200) {
          setHas2fa(res.data);
        } else
            setIsLoading(false);
        // setHasToken(res.status === 200);
      } catch {
        console.log("error in fetching /verify");
      }
    }
    getFirstVerify();
    
    useEffect(() =>  {
      const getAvatar = async () => {
        await axios.get("http://localhost:3001/user/avatar")
        .then((res) => {
          setAvatar(res.data.avatar);
        }).catch(err => {
          console.error("Error in fetching avatar: ", err);
        })
      };
      getAvatar();
      const token = localStorage.getItem('jwt');
      if (token) {
        setHasToken(true);
      }
      setIsLoading(false);
    }, []);

  return (
    <MantineProvider>
      <Router>
        { !isLoading ?
        (
        <Routes>
          <Route path='/' element={!hasToken ? <Login/> : <Home avatar={avatar}/>}/>
          <Route path='/Leaderbord' element={hasToken ? <Leaderbord avatar={avatar}/>  : <Login/>}/>
          <Route path='/Profile' element={hasToken ? <Profile avatar={avatar} />  : <Login/>}/>
          <Route path='/Game' element={hasToken ? <Game avatar={avatar} />  : <Login/>}/>
          <Route path='/Chat' element={hasToken ? <Chat avatar={avatar} />  : <Login/>}/>
          <Route path='/Setting' element={hasToken ? <EditeProfile setAvatar={setAvatar} avatar={avatar} />  : <Login/>}/>
          <Route path='/Login' element={<Login/>}/>
          <Route path='/auth' element={has2fa ? <Auth /> : (!hasToken ? <Login/> : <Home avatar={avatar}/>)}/>
        </Routes>
            ) : <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />}
      {/* <Footer/> */}
      </Router>
      </MantineProvider>
  );
}

export default App