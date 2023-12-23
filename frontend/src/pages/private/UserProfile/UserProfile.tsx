import React from "react";
import Header from "../../../Layout/Header/Header";
import Profile from "./Profile";

function UserProfile({setUserName, userName, avatar}: {setUserName: any, userName: string | null, avatar: string}) {
    return (
        <div>
            <Header avatar={avatar}/>
            <Profile/>
            <h1>User Profile {userName}</h1>
        </div>
    );
}

export default UserProfile