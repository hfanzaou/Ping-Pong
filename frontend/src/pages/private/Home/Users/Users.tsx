import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Avatar, Badge, Table, Group, Text, TextInput, ScrollArea, Button, HoverCard, Menu, rem } from '@mantine/core';
import UsersInterface from './UsersInterface';
import axios from 'axios';
import testdata from './test.json'
import { IconMessages, IconTent, IconTrash, IconUserCircle } from '@tabler/icons-react';
import FriendshipButton from './FriendshipButton';
import { Link, unstable_HistoryRouter, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';

interface stateprops {
    username: string,
    state: string
}

export function StateComponent({userName, socket, userstate}: {userstate: string, userName: string, socket: Socket}) {
    const [state, setState] = useState<string>(userstate);

    useEffect(() => {
        // if (localStorage.getItem(userName) !== null) {
        //     setState(localStorage.getItem(userName) as string);
        // }
        socket?.on('online', ({username, state}: stateprops) => {
            console.log("user name: ", username);
            console.log("state: ", state);
                if (username === userName) {
                    setState(state);
                    // localStorage.setItem(userName, state);
                }
        });
    
        // socket?.on('error', (error) => {
        //     console.error('Error', error);
        // });

        // Clean up the effect
        return () => {
            socket?.off('online');
            // socket?.off('error');
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
                <path fill="#0de34d" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/>
            </svg>
        }

        {/* ongame */}
        {state === "Ongame" &&
            <svg xmlns="http://www.w3.org/2000/svg" height="13" width="13" viewBox="0 0 512 512">
                <path fill="#74C0FC" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/>
            </svg>
        }

        </div>
    );
}

function Users({socket, setUrlName, userList, setUsersList, searchList, setSearchList, handleRequest}: {socket: Socket, setUrlName: Function, userList: UsersInterface[], setUsersList: Function, searchList: UsersInterface[], setSearchList: Function, handleRequest: any}) {
//   const [userList, setUsersList] = useState<UsersInterface[]>([]);
//   const [searchList, setSearchList] = useState<UsersInterface[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [newconnect, setnewconnect] = useState<boolean>(false);
  
const getUsers = async () => {
  await axios.get("user/list")
  .then((res) => {
    // setUsersList(testdata);
    // setSearchList(testdata);
    setUsersList(res.data);
    setSearchList(res.data);
    console.log("Users list00000-->: ", res.data);
  }).catch(err => {
    if (err.response.status === 401) {
      window.location.replace('/login');
    }
    console.error("Error in fetching Users list: ", err);
  })
};

// socket?.on('online', () => {
//     console.log("message from socket: ");
//     setnewconnect(true);
//     // getUsers();
// });

useEffect(() => {
    // if(newconnect){
    //     setnewconnect(false);
    // }
    getUsers();
}, []);

const handelShowProfile = (name: string) => {
    // window.location.replace('/'+name+'/public/profile');
    setUrlName(name);
    // <Link to={'/'+name+'/public/profile'} >

    // window.location.reload();
};

const handleBlockUser = async (name: string) => {
    console.log("blocked friend name: ", name);
    await axios.post("user/block", {name: name})
    .then((res) => {
        if (res.status === 201) {
            getUsers();
        }
        // res.status === 201 && window.location.reload();
    })
    .catch((err) => {
        console.error("error when send post request to block friend: ", err);
    })
  };


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();
  const inputValue = e.target.value;
  setSearchInput(inputValue);
  
    console.log(inputValue.length);
    if (inputValue.length > 0) {
      const filtredList = userList.filter((index) => {  // Filter by carachter no need to filter by name
    //   return index.name.match(inputValue);
        return index.name.toLowerCase().includes(inputValue.toLowerCase())
      });
      console.log(filtredList);
      setSearchList(filtredList);
    }
    else{
      setSearchList(userList);
    }
};

  const search = searchList.map((item) => (
      <Table.Tr key={item.name} m={2}>
      <Table.Td>
        <div className='flex justify-between'>
        <Group gap="md">
            <Menu position='right-start' offset={2}>
            <Menu.Target >

                <div dir="rtl" className="relative"  >
                    <button type="button" className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                    <Avatar size={50} src={item.avatar} radius={50} />
                    <StateComponent userName={item.name} socket={socket} userstate={item.state}/>
                    </button>
                </div>

            </Menu.Target>
            <Menu.Dropdown bg='gray' mt={25}>
            <Menu.Item
              onClick={() => handelShowProfile(item.name)}
                leftSection={
                  <IconUserCircle style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                >
                    <Link to={`/UserProfile?name=${item.name}`}>
                        Show Profile
                    </Link>
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconMessages style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                >
                <Link to={'/Chat'}>Send message</Link>
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
            <Text fz="md" fw={800} c='indigo'>
              {item.name}
            </Text>
            {/* <Text fz="md" fw={600} >
               Level {item.level}
            </Text> */}
            <Text fz="sm" fw={500} c="dimmed">
              level {item.level}         {/*this state was need to be real time*/}
              </Text>
          </div>
        </Group>
<div className=''>
            <FriendshipButton name={item.name} friendship={item.friendship} handleRequest={handleRequest}/>
        </div>
    </div>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className='flex flex-col space-y-4'>
        {/* <div className="flex h-5 w-full items-center rounded-md bg-primary p-4">
            <h2 className="mb-2 mt-1 text-4xl font-medium leading-tight text-primary">
                Users
            </h2>
            </div> */}
            <TextInput className='ml-auto'
              variant="filled"
              radius="md"
              type='search' placeholder='search user' onChange={handleChange} value={searchInput}
              />
    <ScrollArea h={373}>
    <Table verticalSpacing="md" highlightOnHover={false} stickyHeader={false} className='h-full w-full'>
          <Table.Tbody>
            {search}
          </Table.Tbody>
      </Table>
        </ScrollArea>
        </div>
  );
}

export default Users;