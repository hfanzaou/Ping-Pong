import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import FriendshipButton from "../../Home/Users/FriendshipButton";
import SerndMessage from "../../Home/Users/SendMessage";


function Buttons({profile, friendShip, handleRequest}: {profile: any, friendShip: string, handleRequest: any}) {
    const [opened, { open, close }] = useDisclosure(false);
    const [receverName, setReceverName] = React.useState<string>("");

    const handleBlockUser = async (name: string) => {
        await axios.post("user/block", {name: name})
        .then((res) => {
            if (res.status === 201) {
                // getUsers();
            }
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
                        <Button color='gray' radius='xl' onClick={() => handleBlockUser(profile?.usercard?.username)}>Block user</Button>
                        <Button  color='gray' radius='xl' onClick={handleSendMessage}>Send message</Button>
                        <SerndMessage name={receverName} opened={opened} close={close}/>
                    </div>

            </Card>
  );
}

export default Buttons;