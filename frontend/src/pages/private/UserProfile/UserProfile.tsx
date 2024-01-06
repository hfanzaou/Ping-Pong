import React, { useEffect, useState } from "react";
import Header from "../../../Layout/Header/Header";
import Profile from "./Profile";
import axios from "axios";
import UsersInterface from './UsersInterface';
import { Sledding } from "@mui/icons-material";
import { LoadingOverlay } from "@mantine/core";

function UserProfile({avatar, handleRequest, usersList, setUsersList}: {avatar: string, handleRequest: any, usersList: UsersInterface[], setUsersList: Function}) {
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

    const friendShip: any = usersList.find(user => user.name === window.location.pathname.split("/")[1])?.friendship;

        return (
            <div>
                <Header avatar={avatar}/>
                <Profile handleRequest={handleRequest} friendShip={friendShip}/>
            </div>
    );
}

export default UserProfile;