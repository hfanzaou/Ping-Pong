import React, { useEffect, useState } from "react";
import NavBar from './NavBar'
import Nav from './Nav'
import { Socket, io } from "socket.io-client";

function Header({avatar} : {avatar: string}) {

    // const [isOnline, setIsOnline] = useState(navigator.onLine);
              
    // useEffect(() => {
    //   function onlineHandler() {
    //         console.log("online");
    //         setIsOnline(true);
    //   }
    
    //   function offlineHandler() {
    //         console.log("offline");
    //         setIsOnline(false);
    //   }
    
    //   window.addEventListener("online", onlineHandler);
    //   window.addEventListener("offline", offlineHandler);
    
    //   return () => {
    //         window.removeEventListener("online", onlineHandler);
    //         window.removeEventListener("offline", offlineHandler);
    //   };
    // }, []);
    
        return (
            <div className='sticky top-0 z-50' >
               {/* <NavBar avatar={avatar} /> */}
               <Nav avatar={avatar}/>
            </div>
        );
    }





export default Header