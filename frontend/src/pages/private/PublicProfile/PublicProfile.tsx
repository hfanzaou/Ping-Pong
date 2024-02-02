import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import axios from "axios";
import Profile from "./Profile";
import UsersInterface from './UsersInterface';

function PublicProfile({profileName, avatar, handleRequest, usersList, setUsersList, socket}: {profileName: string | undefined,avatar: string, handleRequest: any, usersList: UsersInterface[], setUsersList: Function, socket: Socket}) {
    
    useEffect(() => {
        const getUsers = async () => {
            await axios.get("user/list")
            .then((res) => {
                if (res.status === 200) {
                    setUsersList(res.data);
                }               
            }).catch(err => {
                if (err.response.status === 401) {
                    window.location.replace('/login');
                }
                console.error("Error in fetching Users list: ", err);
            })
        };
         getUsers();
    }, []);

    const friendShip: any = usersList.find(user => user.name == profileName)?.friendship;

    return (
            <Profile profileName={profileName} handleRequest={handleRequest} friendShip={friendShip} socket={socket}/>
    );
}

export default PublicProfile;