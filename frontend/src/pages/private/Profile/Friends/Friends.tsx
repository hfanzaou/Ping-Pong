import React, { useEffect, useState } from 'react';
import { Avatar, Table, Group, Text, Menu, rem, Blockquote} from '@mantine/core';
import { IconMessages, IconTrash, IconUserCircle} from '@tabler/icons-react';
import FriendInterface from './FriendsInterface';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { StateComponent } from '../../Home/Users/Users';


function  Frindes({socket, setUrlName}: {socket: Socket, setUrlName: Function}) {
  const [friendList, setFriendList] = useState<FriendInterface[]>([]);
//   const [searchFriendList, setSearchFriendList] = useState<FriendInterface[]>([]);
  const [value, setValue] = useState<string>('Friends list');

  const handelShowProfile = (name: string) => {
        setUrlName(name);
  };
  
    const getFriends = async () => {
      await axios.get("user/friend/list")
      .then((res) => {
       setFriendList(res.data);
      }).catch(err => {
        // setFriendList(testdata);
        console.error("Error in fetching friend list: ", err);
      })
    };
    
    useEffect(() => {
        getFriends();
    }, []);

  const handleBlockUser = async (name: string) => {

    console.log("blocked friend name: ", name);
    await axios.post("user/block", {name: name})
    .then((res) => {
        if (res.status === 201) {
            getFriends();
        }
        // res.status === 201 && window.location.reload();
    })
    .catch((err) => {
        console.error("error when send post request to block friend: ", err);

    })
  };

  const search = friendList.map((item) => (
    <Table.Tr key={item.name} m={6}>
    <Table.Td>
      <div className='flex justify-between'>
      <Group gap="sm">
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
{/* <div className=''>
          <FriendshipButton name={item.name} friendship={item.friendship} handleRequest={handleRequest}/>
      </div> */}
  </div>
    </Table.Td>
  </Table.Tr>
));

  const rows = friendList.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap="sm">
          <Menu
            position="bottom-start"
            >
            <Menu.Target>
             <Avatar size={40} src={item.avatar} radius={40} />
            </Menu.Target>
            <Menu.Dropdown>
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
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            <Text c="dimmed" fz="xs">
              {item.state}
            </Text>
          </div>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));


  return (
    <div>
        {Object.keys(rows).length ?
            search :
            <Table.Tr>
                <Table.Td>
                    <Blockquote color="gray" radius="xl" iconSize={33} mt="xl">
                        Add Freinds to shows them here
                    </Blockquote>
                </Table.Td>
            </Table.Tr>
        }    
    </div>);
}

export default Frindes