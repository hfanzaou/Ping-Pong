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
import Profile from './pages/private/Profile/Profile'
import EditeProfile from './pages/private/Settings/FditeProfile/EditeProfail'
import EnableTowFactor from './pages/private/Settings/EnableTowFactor'
import Game from './pages/private/Game/Game'
import Chat from './pages/private/Chat/Chat'

import useToken from './pages/public/Login/useToken'
import axios from 'axios'


function App()  {
  const [hasToken, setHasToken] = useState<Boolean>(false);


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
      <Header/>
      <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/Profile' element={<Profile />}/>
          <Route path='/Game' element={<Game />}/>
          <Route path='/Chat' element={<Chat />}/>
          <Route path='/setting' element={<EditeProfile />}/>
      </Routes>
      {/* <Footer/> */}
      </Router>
    </MantineProvider>
  );
}
export default App