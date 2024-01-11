import React, { useEffect } from "react";
import Nav from './Nav'
import { io } from "socket.io-client";
import axios from "axios";

function Header({avatar} : {avatar: string}) {

    useEffect(() => {
		const	socket = io(import.meta.env.VITE_API_BASE_URL);

        socket.on("connect", async () => {
            await axios.get("/user/online").then((res) => {
                console.log("res.data: ", res.data);
                // socket.emit("user/connect", username);
            }).catch(err => {
                console.error("Error in fetching online: ", err);
            })
            // socket.emit("user/connect", username);
        })

        socket.on("disconnect", async () => {
            await axios.get("/user/offline")
            .then((res) => {
                console.log("res.data: ", res.data);
            }).catch(err => {
                console.error("Error in sending socket id: ", err);
            })
        })

        window.onbeforeunload = null;

        const handleBeforeUnload = async () => {
            // ev.preventDefault();
            socket.disconnect();
            await axios.get("/user/offline");
        };
        window.addEventListener("beforeunload", handleBeforeUnload)

		return () => {
            socket.disconnect();
            window.removeEventListener("beforeunload", handleBeforeUnload);
		}
	}, []);

    return (
        <div className='sticky top-0 z-50'>
            <Nav avatar={avatar}/>
        </div>
    );
}

export default Header