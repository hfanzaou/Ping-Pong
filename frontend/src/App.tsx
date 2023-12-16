import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router} from 'react-router-dom'
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
import CreatProfile from './pages/public/CreatProfile/CreatProfile'

function App()  {
    const [avatar, setAvatar] = useState<string>("");
  
    const [hasToken, setHasToken] = useState<Boolean>(false);

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
          <Route path='/Leaderbord' element={hasToken ? <Leaderbord avatar={avatar}/>  : <Navigate to="/"/>}/>
          <Route path='/Profile' element={hasToken ? <Profile avatar={avatar} />  : <Navigate to="/"/>}/>
          <Route path='/Game' element={hasToken ? <Game avatar={avatar} />  : <Navigate to="/"/>}/>
          <Route path='/Chat' element={hasToken ? <Chat avatar={avatar} />  : <Navigate to="/"/>}/>
          <Route path='/Setting' element={hasToken ? <EditeProfile setAvatar={setAvatar} avatar={avatar} />  : <Navigate to="/"/>}/>
          <Route path={'/Login'} element={<Login/>}/>
          <Route path='/Auth' element={<Auth />} />
          <Route path='/creat/profile' element={ <CreatProfile setAvatar={setAvatar} avatar={avatar} /> }/>
        </Routes>
      <Footer/>
      </Router>
      </MantineProvider>
  );
}

export default App