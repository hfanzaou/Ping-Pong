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
        socket?.on("getnotification", () => {
            getFriends();
        });
        return () => {
            socket?.off("getnotification", () => {
                getFriends();
            });
        }
    }, [socket]);

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

    const friends = friendList.map((item) => (
        <Table key={item.name}>
            <Table.Tbody>
                <Table.Tr m={6}>
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
                                    <Menu.Dropdown bg='dark' mt={25}>
                                        <Menu.Item
                                            c='blue'
                                            onClick={() => handelShowProfile(item.name)}
                                        >
                                            <Link to={`/UserProfile?name=${item.name}`}>
                                                <div className='flex items-center space-x-2'>
                                                    <IconUserCircle style={{ width: rem(20), height: rem(20), color: 'cyan' }} stroke={1.5}/>
                                                    <div>Show Profile</div>
                                                </div>
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item
                                            c='red'
                                            onClick={() => handleBlockUser(item.name)}
                                        >
                                            <div className='flex items-center space-x-2'>
                                                <IconTrash style={{ width: rem(20), height: rem(20), color: 'cyan' }} stroke={1.5} />
                                                <div>Block user</div>
                                            </div>
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
            </Table.Tbody>
        </Table>
    ));

    return (
        <div>
            {Object.keys(friends).length ?
                friends :
                <Blockquote className='text-xl'  ta='center' color="white" c='cyan' radius="lg" mt="xl">
                    Add Freinds to shows them here
                </Blockquote>
            }    
        </div>
    );
}

export default Frindes