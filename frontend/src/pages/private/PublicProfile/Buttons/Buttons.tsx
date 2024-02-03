import React from "react";
import axios from "axios";
import { Button, Card } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import FriendshipButton from "../../../../componenet/FriendshipButton";
import SerndMessage from "../../../../componenet/SendMessage";
import { Socket } from "socket.io-client";
import { Link } from "react-router-dom";


function Buttons({profile, friendShip, handleRequest, socket}: {profile: any, friendShip: string, handleRequest: any, socket: Socket}) {
    const [opened, { open, close }] = useDisclosure(false);
    const [receverName, setReceverName] = React.useState<string>("");

    const handleBlockUser = async (name: string) => {
        await axios.post("user/block", {name: name})
        .then((res) => {
        })
        .catch((err) => {
            console.error("error when send post request to block friend: ", err);
        })
    };

    const handleSendMessage = () => {
        setReceverName(profile?.usercard?.username);
        open();
    };

    return (
        <Card className='flex items-center justify-center'  style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg">
            <div className='flex flex-col space-y-3'>
                <FriendshipButton name={profile?.usercard?.username} friendship={friendShip} handleRequest={handleRequest}/>
                <Link to={`/Game?opp=${profile?.usercard?.username}`}>
                    <Button w={160} color='#656A7E' size='xs' radius='xl' onClick={() => {
                        socket?.emit("addnotification", {reciever: profile?.usercard?.username, type: "game"})
                    }}>
                        <div className='text-lg'>
                            play Game
                        </div>
                    </Button>
                </Link>
                <Button size="xs" color='cyan' radius='xl' onClick={handleSendMessage}>
                    <div className='text-lg'>
                        Send message
                    </div>
                </Button>
                <SerndMessage name={receverName} opened={opened} close={close} socket={socket} />
                <Link to='/'>
                    <Button w={160} size="xs" color='#F21616' radius='xl' onClick={() => handleBlockUser(profile?.usercard?.username)}>
                        <div className='text-lg'>
                            Block user
                        </div>
                    </Button>
                </Link>
            </div>
        </Card>
    );
}

export default Buttons;