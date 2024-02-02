import React, { useEffect, useState } from 'react';
import { Avatar, Table, Group, Text, TextInput, ScrollArea, Button, Menu, rem, Textarea, SimpleGrid } from '@mantine/core';
import UsersInterface from './UsersInterface';
import axios from 'axios';
import { IconMessages, IconTrash, IconUserCircle } from '@tabler/icons-react';
import FriendshipButton from '../../../../componenet/FriendshipButton';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { useDisclosure } from '@mantine/hooks';
import SerndMessage from '../../../../componenet/SendMessage';

interface stateprops {
    username: string,
    state: string
}

export function StateComponent({userName, socket, userstate}: {userstate: string, userName: string, socket: Socket}) {
    const [state, setState] = useState<string>(userstate);

    useEffect(() => {
        socket?.on('online', ({username, state}: stateprops) => {
            console.log("user name: ", username);
            console.log("state: ", state);
                if (username === userName) {
                    setState(state);
                }
        });

        // Clean up the effect
        return () => {
            socket?.off('online');
        }

    }, [setState, userName, socket]);

    return (
        <div className="absolute h-14 w-14 top-1 start-1">
            {/* offline */}
            {state === "Offline" &&
                <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 512 512">
                    <path fill="#888281" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/>
                </svg>
            }

            {/* online */}
            {state === "Online" &&
                <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 512 512">
                    <path fill='lime' d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/>
                </svg>
            }

            {/* ongame */}
            {state === "Ongame" &&
                <svg xmlns="http://www.w3.org/2000/svg" height="13" width="13" viewBox="0 0 512 512">
                    <path fill="blue" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/>
                </svg>
            }
        </div>
    );
}

function Users({socket, setUrlName, userList, setUsersList, searchList, setSearchList, handleRequest}: {socket: Socket, setUrlName: Function, userList: UsersInterface[], setUsersList: Function, searchList: UsersInterface[], setSearchList: Function, handleRequest: any}) {

    const [searchInput, setSearchInput] = useState("");
    const [opened, { open, close }] = useDisclosure(false);
    const [receverName, setReceverName] = useState<string>('');
  
    const getUsers = async () => {
        await axios.get("user/list")
        .then((res) => {
            setUsersList(res.data);
            setSearchList(res.data);
        }).catch(err => {
            if (err.response.status === 401) {
                window.location.replace('/login');
            }
            console.error("Error in fetching Users list: ", err);
        })
    };

    useEffect(() => {
        socket?.on("getnotification", () => {
            getUsers();
            return () => {
                socket.off("getnotification");
            }
        });
    }, [socket]);


    useEffect(() => {
        getUsers();
    }, []);

    const handelShowProfile = (name: string) => {
        setUrlName(name);
    };

    const handleBlockUser = async (name: string) => {
        await axios.post("user/block", {name: name})
        .then((res) => {
            if (res.status === 201) {
                getUsers();
            }
        })
        .catch((err) => {
            console.error("error when send post request to block friend: ", err);
        })
    };
    
    const handleSendMessage = (name: string) => {
        setReceverName(name);
        open();
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const inputValue = e.target.value;
        setSearchInput(inputValue);

        if (inputValue.length > 0) {
            const filtredList = userList.filter((index) => {  // Filter by carachter no need to filter by name
                return index.name.toLowerCase().includes(inputValue.toLowerCase())
            });
            setSearchList(filtredList);
        } else {
            setSearchList(userList);
        }
    };


    const search = searchList.map((item) => (
        <Table.Tr key={item.name} m={2}>
            <Table.Td>
                <div className='flex justify-between'>
                    <div className='flex items-center xs:w-[40px] mr-3'>
                        <Menu position='right-start' trigger="hover" openDelay={200} closeDelay={100} offset={2}>
                            <Menu.Target>
                                <div dir="rtl" className="relative" >
                                    <button type="button" className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                                        <Avatar size={50} src={item.avatar} radius={50} />
                                        <StateComponent userName={item.name} socket={socket} userstate={item.state}/>
                                    </button>
                                </div>
                            </Menu.Target>
                            <Menu.Dropdown bg='dark' mt={35}>
                                <Menu.Item
                                    c='blue'                            
                                    onClick={() => handelShowProfile(item.name)}
                                >
                                    <Link to={`/UserProfile?name=${item.name}`}>
                                        <div className='flex items-center space-x-2'>
                                            <IconUserCircle style={{ width: rem(20), height: rem(20), color: 'cyan' }} stroke={1.5} />
                                            <div>Show Profile</div>
                                        </div>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    c='blue'
                                    onClick={() => handleSendMessage(item.name)}
                                >
                                    <div className='flex items-center space-x-2'>
                                        <IconMessages style={{ width: rem(20), height: rem(20), color: 'cyan' }} stroke={1.5} />
                                        <div>Send message</div>
                                    </div>
                                </Menu.Item>
                                <Menu.Item
                                    c='blue'
                                    onClick={() => handleBlockUser(item.name)}
                                    >
                                    <div className='flex items-center space-x-2'>
                                        <IconTrash style={{ width: rem(20), height: rem(20), color: 'cyan' }} stroke={1.5} />
                                        <div>Block user</div>
                                    </div>
                                </Menu.Item>
                            </Menu.Dropdown>
                            <SerndMessage name={receverName} opened={opened} close={close} socket={socket}/>
                        </Menu>
                        <div>
                            <Text fz="md" fw={800} c='indigo'>
                                {item.name}
                            </Text>
                            <Text fz="sm" fw={500} c="dimmed">
                                level {item.level}
                            </Text>
                        </div>
                    </div>
                    <SimpleGrid
                        className='flex items-center jystify-end'
                        cols={{ base: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
                    >
                        <div>

                        <Link to={`/Game?opp=${item.name}`}>
                            <Button w={160} color='teal' size='xs' radius='xl' onClick={() => {
                                socket?.emit("addnotification", {reciever: item.name, type: "game"})
                            }}>
                                <div className='text-lg'>
                                    play Game
                                </div>
                            </Button>
                        </Link>
                        </div>
                            <div>

                        <FriendshipButton name={item.name} friendship={item.friendship} handleRequest={handleRequest}/>
                            </div>
                    </SimpleGrid>
                </div>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className='flex flex-col space-y-2 m-5'>
            <TextInput
                className='ml-auto px-2 rounded-xl'
                ml='auto'
                bg='#5474B4'
                w={300}
                size='lg'
                variant="unstyled"
                placeholder='search user' 
                onChange={(e) => {handleChange(e)}}
                value={searchInput}
            />
            <ScrollArea className='h-[60vh]'>
                <Table verticalSpacing="md" highlightOnHover={false} stickyHeader={false} className='rounded-xl'>
                    <Table.Tbody>
                        {search}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </div>
    );
}

export default Users;