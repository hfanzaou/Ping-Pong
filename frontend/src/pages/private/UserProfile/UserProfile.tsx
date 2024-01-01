import React, { useEffect } from "react";
import Header from "../../../Layout/Header/Header";
import Profile from "./Profile";
import axios from "axios";


function UserProfile({avatar}: {avatar: string}) {
    return (
        <div>
            <Header avatar={avatar}/>
            <Profile/>
        </div>
    );
}

export default UserProfile