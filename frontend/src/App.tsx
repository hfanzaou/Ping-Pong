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
import UsersInterface from './pages/private/Home/Users/UsersInterface'

function App()  {
    const [avatar, setAvatar] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasToken, setHasToken] = useState<Boolean>(false); // true Just for Frontend test
    const [has2fa, setHas2fa] = useState<boolean>(false); // true JUst for frontend test

    const [friendShip, setFriendShip] = useState<any>();
    const [userName, setUserName] = useState<string | null>(null);

    const [userList, setUsersList] = useState<UsersInterface[]>([]);
    const [searchList, setSearchList] = useState<UsersInterface[]>([]);

// comonentDidMount

  axios.defaults.withCredentials = true;  // to send token in every requiste

//   useEffect(() => {
//     const getUsers = async () => {
//       await axios.get("http://localhost:3001/user/list")
//       .then((res) => {
//         // setUsersList(data);
//         // setSearchList(data);
//         setUsersList(res.data);
//         setSearchList(res.data);
//         console.log("Users list00000-->: ", res.data);
//       }).catch(err => {
//         // setUsersList(data);
//         // setSearchList(data);
//         console.error("Error in fetching Users list: ", err);
//       })
//     };
//     getUsers();
// }, []);

const handleRequest = async (name: string) => {

    console.log("Name from handle Request: ", name);

    const user = userList.find(user => user.name === name);
    const friendship = user ? user.friendship : null;
    console.log("friendship from handle Request: ", friendship);

    console.log("friendship from userlist: ", userList.find(user => user.name === window.location.pathname.split("/")[1])?.friendship);

    if (friendship === 'add friend') {
        const updatedUserList = userList.map(user => 
            user.name === name 
            ? {...user, friendship: 'remove request'}
            : user
        );
        setUsersList(updatedUserList);
        setSearchList(updatedUserList);
      await axios.post("http://localhost:3001/user/add/friend", {name: name})
      .then((res) => {
        console.log(res.data);
     })
     .catch((err) => {
        console.log("Error in send post request to add friend ",err);
     })
    }else if (friendship === 'remove request') {
        const updatedUserList = userList.map(user => 
            user.name === name 
            ? {...user, friendship: 'add friend'}
            : user
        );
        setUsersList(updatedUserList);
        setSearchList(updatedUserList);
        await axios.post("http://localhost:3001/user/remove/request", {name: name})
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log("Error in send post request to remove request",err);
        })
    } else if (friendship === 'remove friend') {
        const updatedUserList = userList.map(user => 
            user.name === name 
            ? {...user, friendship: 'add friend'}
            : user
        );
        setUsersList(updatedUserList);
        setSearchList(updatedUserList);
        await axios.post("http://localhost:3001/user/remove/friend", {name: name})
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log("Error in send post request to remove friend ",err);
        })
    }else if (friendship === 'accept friend') {
        const updatedUserList = userList.map(user => 
            user.name === name 
            ? {...user, friendship: 'remove friend'}
            : user
        );
        setUsersList(updatedUserList);
        setSearchList(updatedUserList);
        await axios.post("http://localhost:3001/user/accept/friend", {name: name})
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log("Error in send post request to accept friend ",err);
        })
    }
  };

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
      else
        setIsLoading(false);
}, []);

  return (
    <MantineProvider>
      <Router>
        { !isLoading ?
        (
        <Routes>
          <Route path='/' element={!hasToken ? <Login/> : <Home userList={userList} setUsersList={setUsersList} searchList={searchList} setSearchList={setSearchList} handleRequest={handleRequest} avatar={avatar}/>}/>
          <Route path='/Leaderbord' element={hasToken ? <Leaderbord avatar={avatar}/>  : <Login/>}/>
          <Route path='/Profile' element={hasToken ? <Profile avatar={avatar} setUserName={setUserName} />  : <Login/>}/>
          <Route path='/Game' element={hasToken ? <Game avatar={avatar} />  : <Login/>}/>
          <Route path='/Chat' element={hasToken ? <ChatApp avatar={avatar} />  : <Login/>}/>
          <Route path='/Setting' element={hasToken ? <EditeProfile setAvatar={setAvatar} avatar={avatar} />  : <Login/>}/>
          <Route path={'/'+window.location.pathname.split("/")[1]+'/public/profile'} element={hasToken ? <UserProfile  avatar={avatar} handleRequest={handleRequest} usersList={userList} setUsersList={setUsersList} /> : <Login/>} />
          <Route path='/Login' element={<Login/>}/>
          <Route path='/auth' element={has2fa ? <Auth /> : (!hasToken ? <Login/> : <Home userList={userList} setUsersList={setUsersList} searchList={searchList} setSearchList={setSearchList} handleRequest={handleRequest} avatar={avatar}/>)}/>
        </Routes>
            ) : <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />}
      {/* <Footer/> */}
      </Router>
      </MantineProvider>
  );
}

export default App