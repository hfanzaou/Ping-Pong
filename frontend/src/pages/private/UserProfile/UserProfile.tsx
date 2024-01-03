import React, { useEffect } from "react";
import Header from "../../../Layout/Header/Header";
import Profile from "./Profile";
import axios from "axios";


function UserProfile({avatar, handleRequest}: {avatar: string, handleRequest: any}) {
    return (
        <div>
            <Header avatar={avatar}/>
            <Profile handleRequest={handleRequest}/>
        </div>
    );
}

export default UserProfile;