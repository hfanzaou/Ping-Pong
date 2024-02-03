import React, { useEffect } from "react";
import Nav from './navBar/Nav'
import { Socket, io } from "socket.io-client";

interface Props {
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>,
    socket: Socket | null,
    avatar: string,
    handleRequest: Function,
}

const   Header: React.FC<Props> = ({ setSocket, socket, avatar, handleRequest }) => {
    async function callBack(socket: Socket) {
        try {
            const res0 = await fetch("user/name", {
                credentials: "include"
            });
            const Data0 = await res0.json();
            if (Data0.name && socket.id)
            {
                try {
                    await fetch("onlineoffline", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            socket: socket.id,
                            username: Data0.name
                        }),
                        credentials: "include"
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
    }

    useEffect(() => {
        const   socket = io(window.location.host, {
            withCredentials: true
        });
        socket.on("connect", async () => {
            setSocket(socket);
            await callBack(socket);
            socket.emit("state");
        })
        setSocket(socket);
        return () => {
            socket.disconnect();
            socket.off("connect", async () => {
                setSocket(socket);
                await callBack(socket);
                socket.emit("state");
            })
        }
    }, [])
    
    return (
        <div className='sticky top-0 z-50'>
            {socket && <Nav socket={socket} avatar={avatar} handleRequest={handleRequest}/>}
        </div>
    );
}

export default Header