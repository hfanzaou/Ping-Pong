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
                <Button size="xs" color='cyan' radius='xl' onClick={handleSendMessage}>
                    <div className='text-lg'>
                        Send message
                    </div>
                </Button>
                <Button size="xs" color='red' radius='xl' onClick={() => handleBlockUser(profile?.usercard?.username)}>
                    <div className='text-lg'>
                        <Link to='/'>
                            Block user
                        </Link>
                    </div>
                </Button>
                <SerndMessage name={receverName} opened={opened} close={close} socket={socket} />
            </div>
        </Card>
    );
}

export default Buttons;