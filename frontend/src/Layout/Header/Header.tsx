import React, { useEffect } from "react";
import Nav from './Nav'
import { Socket, io } from "socket.io-client";

interface Props {
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>,
    avatar: string,
}

const   Header: React.FC<Props> = ({ setSocket, avatar }) => {
    async function callBack(socket: Socket) {
        try {
            const res0 = await fetch("http://localhost:3001/user/name", {
                credentials: "include"
            });
            const Data0 = await res0.json();
            if (Data0.name)
            {
                try {
                    await fetch("http://localhost:3001/onlineoffline", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            socket: socket.id,
                            username: Data0.name
                        })
                    });
                }
                catch {
                    throw new Error("error");
                }
            }
        }
        catch {
            return ;
        }
        // await fetch("http://localhost:3001/onlineoffline", {
        //     method: "POST",
        //     headers: {
        //         "content-type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         socket: socket.id,
        //         username: 
        //     })
        // });
    }
    useEffect(() => {
        const   socket = io("http://localhost:3001", {
            withCredentials: true
        });
        socket.on("connect", async () => {
            // console.log(socket.id)
            setSocket(socket);
            await callBack(socket);
            socket.emit("state");
            // console.log("connected");
        })
        setSocket(socket);
        return () => {
            socket.disconnect();
            socket.off("connect", async () => {
                setSocket(socket);
            await    callBack(socket);
            socket.emit("state");

            })
        }
    }, [])
    return (
        <div className='sticky top-0 z-50'>
            <Nav avatar={avatar}/>
        </div>
    );
}

export default Header