import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router} from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'

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

import useToken from './pages/public/Login/useToken'
import axios from 'axios'


function App()  {
    const [avatar, setAvatar] = useState<string>("");
  const [hasToken, setHasToken] = useState<Boolean>(false);
// comonentDidMount

  axios.defaults.withCredentials = true;  // to send token in every requiste


  // useEffect(() => {
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
        //   .then((res) => {
        //       console.log("here-");
        //       setHasToken(true);
        //     })
        //     .catch((err) => {
        //         setHasToken(false);
        //         console.log("Error In fetching /verify ", err);
        //     })
        };
        getVerify();
    // }, []);

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

  if (!hasToken) {
    return (
     <Login />
    // <Router>
    //   <Routes>
    //   <Route path='/login' element={<Login />}/>

    //   <Route path='/Profile/Edite' element={<EditeProfile />}/>
    //   </Routes>
    //   </Router>

    );
  }

    return (
    <MantineProvider>
    <Router>
      {/* <Header setAvatar={setAvatar} avatar={avatar}/> */}
      <Routes>
          <Route path='/' element={<Home avatar={avatar} />}/>
            <Route path='/Leaderbord' element={<Leaderbord avatar={avatar} />}/>
          <Route path='/Profile' element={<Profile avatar={avatar} />}/>
          <Route path='/Game' element={<Game avatar={avatar} />}/>
          <Route path='/Chat' element={<Chat avatar={avatar} />}/>
          <Route path='/setting' element={<EditeProfile setAvatar={setAvatar} avatar={avatar} />}/>
      </Routes>
      {/* <Footer/> */}
      </Router>
    </MantineProvider>
  );
}
export default App