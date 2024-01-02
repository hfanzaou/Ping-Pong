import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router} from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import { LoadingOverlay, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import './index.css'
import Login from './pages/public/Login/Authentication';
import  Home from './pages/private/Home/Home'
import Leaderbord from './pages/private/Dashbord/Leaderbord'
import Profile from './pages/private/Profile/Profile'
import EditeProfile from './pages/private/Settings/FditeProfile/EditeProfail'
import Game from './pages/private/Game/Game'
import ChatApp from './pages/private/Chat/ChatApp'
import axios from 'axios'
import Auth from './pages/public/Auth'
import UserProfile from './pages/private/UserProfile/UserProfile'

function App()  {
    const [avatar, setAvatar] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [hasToken, setHasToken] = useState<Boolean>(false); // true Just for Frontend test
    const [has2fa, setHas2fa] = useState<boolean>(false); // true JUst for frontend test

    const [userName, setUserName] = useState<string | null>(null);

// comonentDidMount

  axios.defaults.withCredentials = true;  // to send token in every requiste

    // useEffect(() => {

//         async function callBack(socket: Socket) {
//             // setData(prev => setSocket(prev, socket));
//     const res = await fetch("http://localhost:3001/user", {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ socket: socket.id })
//     });
//     const Data = await res.json();
//     // setData(prev => setUserData(prev, Data));
// }

// useEffect(() => {

//         const	socket = io("http://localhost:3001");
//         socket.on("connect", async () => {
//             await callBack(socket);
//         })
//         return () => {
//             socket.disconnect();
//             socket.off("connect", async () => {
//                 await callBack(socket);
//             })
//         }

// }, []);










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
 
    // useEffect(() => {
    //     setUserName(Cookies.get('userName'));
    // }, [userName]);
    
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
      else
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
          <Route path='/Profile' element={hasToken ? <Profile avatar={avatar} setUserName={setUserName} />  : <Login/>}/>
          <Route path='/Game' element={hasToken ? <Game avatar={avatar} />  : <Login/>}/>
          <Route path='/Chat' element={hasToken ? <ChatApp username={userName} />  : <Login/>}/>
          <Route path='/Setting' element={hasToken ? <EditeProfile setAvatar={setAvatar} avatar={avatar} />  : <Login/>}/>
          <Route path={'/'+window.location.pathname.split("/")[1]+'/public/profile'} element={hasToken ? <UserProfile  avatar={avatar}/> : <Login/>} />
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