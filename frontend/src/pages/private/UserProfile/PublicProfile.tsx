import React, { useEffect, useState } from "react";
import Header from "../../../Layout/Header/Header";
import Profile from "./Profile";
import axios from "axios";
import UsersInterface from './UsersInterface';
import { LoadingOverlay } from "@mantine/core";

function PublicProfile({profileName, avatar, handleRequest, usersList, setUsersList}: {profileName: string | undefined,avatar: string, handleRequest: any, usersList: UsersInterface[], setUsersList: Function}) {
    useEffect(() => {
        const getUsers = async () => {
            await axios.get("user/list")
            .then((res) => {
                if (res.status === 200) {
                    setUsersList(res.data);
                }               
            }).catch(err => {
                console.error("Error in fetching Users list: ", err);
            })
        };
         getUsers();
    }, []);

    const friendShip: any = usersList.find(user => user.name == profileName)?.friendship;

        return (
            <div>
                {/* <Header avatar={avatar}/> */}
                <Profile profileName={profileName} handleRequest={handleRequest} friendShip={friendShip}/>
            </div>
    );
}

export default PublicProfile;