import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router} from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import { LoadingOverlay, MantineProvider } from '@mantine/core'
import Login from './pages/public/Login/Authentication';
import Home from './pages/private/Home/Home'
import Leaderbord from './pages/private/Dashbord/Leaderbord'
import Profile from './pages/private/Profile/Profile'
import EditeProfile from './pages/private/Settings/FditeProfile/EditeProfail'
import Game from './pages/private/Game/Game'
import ChatApp from './pages/private/Chat/ChatApp'
import axios from 'axios'
import Auth from './pages/public/Auth'
import PublicProfile from './pages/private/UserProfile/PublicProfile'
import UsersInterface from './pages/private/Home/Users/UsersInterface'
import NotFound from './pages/public/NotFound/NotFound'
import GoToLogin from './pages/public/GoToLogin/GoToLogin'
import '@mantine/core/styles.css'
import './index.css'
import Header from './Layout/Header/Header';
import { Socket } from 'socket.io-client';
import Message from './pages/public/Message';
import ScrollUp from './componenet/ScrollUp';

function App()  {
    const [avatar, setAvatar] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasToken, setHasToken] = useState<Boolean>(false); // true Just for Frontend test
    const [has2fa, setHas2fa] = useState<boolean>(false); // true JUst for frontend test
    const [urlName, setUrlName] = useState<string | undefined>();

    const [userList, setUsersList] = useState<UsersInterface[]>([]);
    const [searchList, setSearchList] = useState<UsersInterface[]>([]);
    const   [socket, setSocket] = useState<Socket | null>(null);
    // comonentDidMount

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    // console.log("base url: ", apiUrl);

    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = apiUrl;



const handleRequest = async (name: string) => {

    console.log("Name from handle Request: ", name);

    const user = userList.find(user => user.name === name);
    const friendship = user ? user.friendship : null;
    console.log("friendship from handle Request: ", friendship);
    //

    // console.log("friendship from userlist: ", userList.find(user => user.name === window.location.pathname.split("/")[1])?.friendship);

    if (friendship === 'add friend') {
        const updatedUserList = userList.map(user => 
            user.name === name 
            ? {...user, friendship: 'remove request'}
            : user
        );
        setUsersList(updatedUserList);
        setSearchList(updatedUserList);
      await axios.post("user/add/friend", {name: name})
      .then((res) => {
        socket?.emit("addnotification", {reciever: name, type: "friend request"})
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
        await axios.post("user/remove/request", {name: name})
        .then((res) => {
            socket?.emit("addnotification", {reciever: name, type: "remove request"})
<<<<<<< HEAD
            console.log(res.data);
=======
          console.log(res.data);
>>>>>>> origin/master
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
        await axios.post("user/remove/friend", {name: name})
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
        await axios.post("user/accept/friend", {name: name})
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log("Error in send post request to accept friend ",err);
        })
    }
};

    useEffect(() => {
        const getVerify = async () => {
            try {
                const res = await axios.get('verify');
                if (res.status === 200) {
                setHasToken(true);
                setIsLoading(false);
                }
            } catch {
                setIsLoading(false);
                console.log("error in fetching /verify");
            }
        }

        const getVerifyTfa = async () => {
            try {
                const res = await axios.get('verifyTfa');
                if (res.status === 200) {
                setHas2fa(res.data);
                }
            } catch {
            console.log("error in fetching /verify");
            }
        }

        const getAvatar = async () => {
            await axios.get("user/avatar")
            .then((res) => {
                setAvatar(res.data.avatar);
            }).catch(err => {
                console.error("Error in fetching avatar: ", err);
            })
        }
        
        getVerify();
        getVerifyTfa();
        getAvatar();

        // Get the URLSearchParams object from the current URL
        const query = new URLSearchParams(window.location.search);
        setUrlName(query.get('name') || undefined);
    }, []);

    if (isLoading) {
        return (
            <MantineProvider>
                <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            </MantineProvider>
        );
    }

    if (!hasToken) {
        if (has2fa) {
            return (
                <MantineProvider>
                    <Router>
                        <Routes>
                            <Route path='/' element={<Login/>}/>
                            <Route path='/Login' element={<Login/>}/>
                            <Route path='/auth' element={<Auth/>}/>
                            <Route path='/*' element={<Login/>} />
                        </Routes>
                    </Router>
                </MantineProvider>
            );
        }

        return (
            <MantineProvider>
                <Router>
                    <Routes>
                        <Route path='/' element={<Login/>}/>
                        <Route path='/Login' element={<Login/>}/>
                        <Route path='/*' element={<GoToLogin />} />
                        {/* {has2fa && <Route path='/auth' element={<Auth/>}/> } */}
                    </Routes>
                </Router>
            </MantineProvider>
        );
    }

    return (
        <MantineProvider>
            <Router>
             <Header socket={socket} setSocket={setSocket} avatar={avatar}/>
            <ScrollUp/>
                <Routes>
                    <Route path='*' element={<NotFound />}/>
                    <Route path='/' element={ socket && <Home socket={socket}  setUrlName={setUrlName} userList={userList} setUsersList={setUsersList} searchList={searchList} setSearchList={setSearchList} handleRequest={handleRequest} avatar={avatar}/>}/>
                    <Route path='/Leaderbord' element={<Leaderbord avatar={avatar}/>}/>
                    <Route path='/Profile' element={socket && <Profile socket={socket} setUrlName={setUrlName} avatar={avatar}/>}/>
                    <Route path='/Game' element={<Game avatar={avatar}/>}/>
                    <Route path='/Chat' element={socket && <ChatApp socket={socket}/>}/>
                    <Route path='/Setting' element={<EditeProfile setAvatar={setAvatar} avatar={avatar}/>}/>
                    <Route path={'/UserProfile'} element={<PublicProfile profileName={urlName}  avatar={avatar} handleRequest={handleRequest} usersList={userList} setUsersList={setUsersList}/>} />
                    {/* <Route path='/Login' element={!hasToken ? <Login/> : <Home  userList={userList} setUsersList={setUsersList} searchList={searchList} setSearchList={setSearchList} handleRequest={handleRequest} avatar={avatar}/> }/> */}
                    {/* <Route path='/auth' element={has2fa ? <Auth/>  : <Home userList={userList} setUsersList={setUsersList} searchList={searchList} setSearchList={setSearchList} handleRequest={handleRequest} avatar={avatar}/>}/> */}
                </Routes>
            </Router>
        </MantineProvider>
    );
    
}

export default App





// return (
//   <MantineProvider>
//     <Router>
//       <Routes>
//           <Route path='/*' element={hasToken ? <NotFound />  : <Login/>}/>
//         <Route path='/' element={!hasToken ? <Login/> : <Home userList={userList} setUsersList={setUsersList} searchList={searchList} setSearchList={setSearchList} handleRequest={handleRequest} avatar={avatar}/>}/>
//         <Route path='/Leaderbord' element={hasToken ? <Leaderbord avatar={avatar}/>  : <Login/>}/>
//         <Route path='/Profile' element={hasToken ? <Profile avatar={avatar} setUserName={setUserName} />  : <Login/>}/>
//         <Route path='/Game' element={hasToken ? <Game avatar={avatar} />  : <Login/>}/>
//         <Route path='/Chat' element={hasToken ? <ChatApp avatar={avatar} />  : <Login/>}/>
//         <Route path='/Setting' element={hasToken ? <EditeProfile setAvatar={setAvatar} avatar={avatar} />  : <Login/>}/>
//         <Route path={'/'+window.location.pathname.split("/")[1]+'/public/profile'} element={hasToken ? <UserProfile  avatar={avatar} handleRequest={handleRequest} usersList={userList} setUsersList={setUsersList} /> : <Login/>} />
//         <Route path='/Login' element={<Login/>}/>
//         <Route path='/auth' element={has2fa && !hasToken ? <Auth /> :  <Home userList={userList} setUsersList={setUsersList} searchList={searchList} setSearchList={setSearchList} handleRequest={handleRequest} avatar={avatar}/>}/>
//       </Routes>
//     </Router>
//     </MantineProvider>
// );










// {/* <Footer/> */}
