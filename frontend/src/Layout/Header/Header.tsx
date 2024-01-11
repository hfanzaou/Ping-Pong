import React, { useEffect } from "react";
import Nav from './Nav'
import { io } from "socket.io-client";
import axios from "axios";

function Header({avatar} : {avatar: string}) {



    return (
        <div className='sticky top-0 z-50'>
            <Nav avatar={avatar}/>
        </div>
    );
}

export default Header