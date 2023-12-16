import React, { useEffect, useState } from 'react'
import { Link, BrowserRouter as Router} from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import { Outlet, Navigate } from 'react-router-dom'

import { MantineProvider } from '@mantine/core'
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

function App()  {
    const [avatar, setAvatar] = useState<string>("");
  
    const [hasToken, setHasToken] = useState<Boolean>(false);
    const [hasFirstToken, setHasFirstToken] = useState<boolean>(false);

// comonentDidMount

  axios.defaults.withCredentials = true;  // to send token in every requiste
  
    const getVerify = async () => {
      try {
        const res = await axios.get('http://localhost:3001/verify');
        if (res.status === 200) {
          setHasToken(true);
        }
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
          setHasFirstToken(true);
        }
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
    }, []);

  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path='/' element={!hasToken ? <Login/> : <Home avatar={avatar}/>}/>
          <Route path='/Leaderbord' element={hasToken ? <Leaderbord avatar={avatar}/>  : <Login/>}/>
          <Route path='/Profile' element={hasToken ? <Profile avatar={avatar} />  : <Login/>}/>
          <Route path='/Game' element={hasToken ? <Game avatar={avatar} />  : <Login/>}/>
          <Route path='/Chat' element={hasToken ? <Chat avatar={avatar} />  : <Login/>}/>
          <Route path='/Setting' element={hasToken ? <EditeProfile setAvatar={setAvatar} avatar={avatar} />  : <Login/>}/>
          <Route path='/creat/profile' element={!hasFirstToken ? <CreatProfile setAvatar={setAvatar} avatar={avatar}/> :<Home avatar={avatar}/>}/>
          <Route path='/Login' element={<Login/>}/>
          <Route path='/auth' element={ <Auth /> } />
        </Routes>
      {/* <Footer/> */}
      </Router>
      </MantineProvider>
  );
}

export default App