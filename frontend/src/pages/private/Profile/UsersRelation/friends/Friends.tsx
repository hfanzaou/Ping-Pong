import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Table, Group, Text, Menu, rem, Blockquote} from '@mantine/core';
import { IconTrash, IconUserCircle} from '@tabler/icons-react';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import FriendInterface from './FriendsInterface';
import { StateComponent } from '../../../Home/Users/Users';

function  Frindes({socket, setUrlName}: {socket: Socket, setUrlName: Function}) {
    const [friendList, setFriendList] = useState<FriendInterface[]>([]);

    const handelShowProfile = (name: string) => {
        setUrlName(name);
    };
  
    const getFriends = async () => {
        await axios.get("user/friend/list")
        .then((res) => {
            setFriendList(res.data);
        }).catch(err => {
            console.error("Error in fetching friend list: ", err);
        })
    };

    useEffect(() => {
        getFriends();
    }, []);

    const handleBlockUser = async (name: string) => {
        await axios.post("user/block", {name: name})
        .then((res) => {
            if (res.status === 201) {
                getFriends();
            }
        })
        .catch((err) => {
            console.error("error when send post request to block friend: ", err);
        })
    };

    const search = friendList.map((item) => (
        <Table.Tr key={item.name} m={6}>
            <Table.Td>
                <div className='flex justify-between'>
                    <Group gap="md">
                        <Menu position='right-start' trigger="hover" openDelay={200} closeDelay={100} offset={2}>
                            <Menu.Target >
                                <div dir="rtl" className="relative"  >
                                    <button type="button" className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white"> 
                                        <Avatar size={40} src={item.avatar} radius={40} />
                                        <StateComponent userName={item.name} socket={socket} userstate={item.state}/>
                                    </button>
                                </div>
                            </Menu.Target>
                            <Menu.Dropdown bg='gray' mt={25}>
                                <Menu.Item
                                    onClick={() => handelShowProfile(item.name)}
                                    leftSection={<IconUserCircle style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                                >
                                    <Link to={`/UserProfile?name=${item.name}`}>Show Profile</Link>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => handleBlockUser(item.name)}
                                    leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                                >
                                    Block user
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                        <div>
                            <Text fz="md" fw={800} c='indigo'>{item.name}</Text>
                            <Text fz="sm" fw={500} c="dimmed">level {item.level}</Text>
                        </div>
                    </Group>
                </div>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div>
            {Object.keys(search).length ?
                search :
                <Table.Tr>
                    <Table.Td>
                        <Blockquote color="gray" radius="xl" iconSize={33} mt="xl">
                            Add Freinds to shows them here
                        </Blockquote>
                    </Table.Td>
                </Table.Tr>
            }    
        </div>
    );
}

export default Frindes