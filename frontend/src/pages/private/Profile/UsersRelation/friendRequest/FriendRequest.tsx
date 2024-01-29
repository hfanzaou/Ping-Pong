import React, { useEffect, useState } from 'react';
import { Avatar, Table, Group, Text, Blockquote, Button } from '@mantine/core';
import FriendInterface from '../friends/FriendsInterface';
import { Socket } from 'socket.io-client';
import axios from 'axios';
import { StateComponent } from '../../../Home/Users/Users';

function  FrindeRequest({socket}: {socket: Socket}) {
    const [requestFriendList, setRequestFriendList] = useState<FriendInterface[]>([]);

    const getRequests = async () => {
        await axios.get("user/friend/requests")
        .then((res) => {
            setRequestFriendList(res.data);
        }).catch(err => {
            console.error("Error in fetching friend requests: ", err);
        })
    };

    useEffect(() => {
        getRequests();
    }, []);

    const handleAccepteFriend = async (name: string) => {
        await axios.post("user/accept/friend", {name: name})
        .then((res) => {
            if (res.status === 201) {
                getRequests();
            }
        })
        .catch((err) => {
            console.error("error when send post request to accepte friend: ", err);
        })
    }

    const requestRows = requestFriendList.map((item) => (
        <Table.Tr key={item.name}>
            <Table.Td>
            <div className='flex justify-between items-center space-x-[90px]'>
                <Group gap="sm">
                    <div className='flex flex-col items-center'>
                        <div dir="rtl" className="relative">
                            <button type="button" className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white"> 
                                <Avatar size={40} src={item.avatar} radius={40} />
                                <StateComponent userName={item.name} socket={socket} userstate={item.state}/>
                            </button>
                        </div>
                        <Text fz="md" fw={800} c='indigo'>{item.name}</Text>
                    </div>
                </Group>
                <Button size='xs' radius='xl' color='green' onClick={() => handleAccepteFriend(item.name)}>
                    Accept
                </Button>
                </div>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div>
            {Object.keys(requestRows).length ?
                requestRows :
                <Table.Tr>
                    <Table.Td>
                        <Blockquote color="gray" radius="xl" iconSize={33} mt="xl">
                            No Friend Requests
                        </Blockquote>
                    </Table.Td>
                </Table.Tr>
            }
        </div>
  );
}

export default FrindeRequest