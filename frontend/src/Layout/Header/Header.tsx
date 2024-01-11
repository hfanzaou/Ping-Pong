import React, { useEffect } from "react";
import Nav from './Nav'
import { Socket, io } from "socket.io-client";

interface Props {
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>,
    avatar: string
}

const   Header: React.FC<Props> = ({ setSocket, avatar}) => {
    useEffect(() => {
        const   socket = io("http://localhost:3001", {
            withCredentials: true
        });
        // console.log(socket);
        setSocket(socket);
        return () => {
            socket.disconnect();
        }
    }, [])
    return (
        <div className='sticky top-0 z-50'>
            <Nav avatar={avatar}/>
        </div>
    );
}

export default Header