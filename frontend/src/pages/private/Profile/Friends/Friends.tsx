import React, { useEffect, useState } from 'react';
import { Avatar, Table, Group, Text, Menu, rem, ScrollArea, Blockquote, SegmentedControl, Button } from '@mantine/core';
import { IconMessages, IconTrash, IconFriends, IconFriendsOff} from '@tabler/icons-react';
import FriendInterface from './FriendsInterface';
import FrindsImage from './friends.svg';

import testdata from './FriendsList.json';
import axios from 'axios';
import BlockedFriendInterface from './BlockedFriendInterface';



function  Frindes() {
  const [friendList, setFriendList] = useState<FriendInterface[]>([]);
  const [blockedFriendList, setBlockedFriendList] = useState<FriendInterface[]>([]);
  const [searchFriendList, setSearchFriendList] = useState<FriendInterface[]>([]);
  const [value, setValue] = useState<string>('Friends list');

  useEffect(() => {
    const getFriends = async () => {
      await axios.get("http://localhost:3001/friend/list")
      .then((res) => {
       setFriendList(res.data);
      }).catch(err => {
        setFriendList(testdata);
        console.error("Error in fetching friend list: ", err);
      })
    };
    const getBlockedFriends = async () => {
        await axios.get("http://localhost:3001/friend/blocked")
        .then((res) => {
         setBlockedFriendList(res.data);
        }).catch(err => {
          setBlockedFriendList(testdata);
            console.error("Error in fetching blocked friend list: ", err);
        })
    };
    getBlockedFriends();
    getFriends();
  }, []);

  const handleBlockFriend = async (name: string) => {
    console.log("blocked friend name: ", name);
    await axios.post("http://localhost:3001/block/friend", {name: name})
    .then((res) => {
        res.status === 201 && window.location.reload();
    })
    .catch((err) => {
        console.error("error when send post request to block friend: ", err);
    })
  };

  const handleInBlockFriend = async (name: string) => {
    console.log("blocked friend name: ", name);
    await axios.post("http://localhost:3001/inblock/friend", {name: name})
    .then((res) => {
        res.status === 201 && window.location.reload();
    })
    .catch((err) => {
        console.error("error when send post request to In block friend: ", err);
    })
  };

  const rows = friendList.map((item) => (
//   const rows = testdata.map((item) => (

  <Table key={item.name}>
      <Table.Td>
        <Group gap="sm">
          <Menu
            transitionProps={{ transition: 'pop' }}
            withArrow
            position="bottom-end"
            withinPortal
            >
            <Menu.Target>
             <Avatar size={40} src={item.avatar} radius={40} />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconMessages style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                >
                Send message
              </Menu.Item>
 
              <Menu.Item
                leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                color="red"
                >
                  <button onClick={() => handleBlockFriend(item.name)}>
                      Block friend
                  </button>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            <Text c="dimmed" fz="xs">
              {item.status}
            </Text>
          </div>
        </Group>
      </Table.Td>
    </Table>
  ));

  const blockedRows = blockedFriendList.map((item) => (  
    <Table key={item.name}>
        <Table.Td>
          <Group gap="sm">
            <Menu
              transitionProps={{ transition: 'pop' }}
              withArrow
              position="bottom-end"
              withinPortal
              >
              <Menu.Target>
               <Avatar size={40} src={item.avatar} radius={40} />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                  color="red"
                  >
                    <button onClick={() => handleInBlockFriend(item.name)}>
                      InBlock friend
                    </button>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <div>
              <Text fz="sm" fw={500}>
                {item.name}
              </Text>
            </div>
          </Group>
        </Table.Td>
      </Table>
    ));

  const FriendsIcon = <IconFriends  size={60} strokeWidth={1.5} color={'#4078bf'}/>
  const FriendsOffIcon = <IconFriendsOff size={60} strokeWidth={1.5} color={'#4078bf'}/>

  const frindesNumber = 5;
  const blockedFriendsNumbre = 0;

  return (
    <div className='relative flex '>
        <Table>
          <Table.Thead>
            <div className="flex h-16 w-full items-center rounded-md bg-primary p-4">
                {value === 'Friends list' && 
                (<div className='flex'>
                    <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">{frindesNumber}</h2>
                    {FriendsIcon}
                    {/* <img className='h-[70px] w-[50px]' src={FrindsImage}/> */}
                </div>)}
                {/* {value === 'Friends list' ? FriendsIcon : FriendsOffIcon} */}
                <SegmentedControl
                    fullWidth
                    size='lg'
                    radius='xl'
                    value={value}
                    onChange={setValue}
                    data={[
                        { label: 'Friends list', value: 'Friends list' },
                        // { label: 'Friends list', value: FriendsIcon },  // when make the icone for the blocked users change the value to the icon
                        { label: 'Blocked Users', value: 'Blocked Users', disabled: blockedFriendsNumbre === 0 },
                    ]}
                />
                {value === 'Blocked Users' &&
                (<div className='flex'>
                    {FriendsOffIcon}
                    {/* <img className='h-[70px] w-[50px]' src={FrindsImage}/> */}
                    <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">{blockedFriendsNumbre}</h2>
                </div>)}
            </div>
          </Table.Thead>
          {value === 'Friends list' ?
          (Object.keys(rows).length ?
            (<ScrollArea h={200} type='never'>
            <Table.Tbody>
            {rows}
            </Table.Tbody>
            </ScrollArea>) :
            (<Blockquote color="gray" radius="xl" iconSize={33} mt="xl">
              Add Freinds to shows them here
            </Blockquote>)
          )
          :
        (blockedFriendsNumbre &&
            <ScrollArea h={200} type='never'>
            <Table.Tbody>
            {blockedRows}
            </Table.Tbody>
            </ScrollArea>)}
        </Table>
    </div>
  );
}

export default Frindes