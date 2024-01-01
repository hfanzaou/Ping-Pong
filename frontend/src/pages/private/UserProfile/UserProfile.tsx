import React, { useEffect } from "react";
import Header from "../../../Layout/Header/Header";
import Profile from "./Profile";
import axios from "axios";

function UserProfile({setUserName, userName, avatar}: {setUserName: any, userName: string | null, avatar: string}) {
    useEffect(() => {
        const getUserProfile = async () => {
            await axios.get("http://localhost:3001/user/profile", {params: {name: userName}})
            .then((res) => {
                console.log("user profile: ", res.data);
                // setProfile(res.data);
            })
            .catch((err) => {
                console.error("error when send get request to get user profile: ", err);
            })
        }

        getUserProfile();
    })


    return (
        <div>
            <Header avatar={avatar}/>
            <Profile/>
            {/*<h1>User Profile {userName}</h1>*/}
        </div>
    );
}

export default UserProfile;