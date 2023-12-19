import React, { useEffect, useState } from 'react';
import { Avatar, Table, Group, Text, Menu, rem, ScrollArea, Blockquote, SegmentedControl, Button } from '@mantine/core';
import { IconMessages, IconTrash, IconFriends, IconFriendsOff} from '@tabler/icons-react';
import FriendInterface from './FriendsInterface';

import testdata from './FriendsList.json';
import axios from 'axios';
import BlockedFriends from './BlockedFriends';

function  Frindes() {
  const [friendList, setFriendList] = useState<FriendInterface[]>([]);
  const [requestFriendList, setRequestFriendList] = useState<FriendInterface[]>([]); // this is for the request list [not implemented yet]
  const [searchFriendList, setSearchFriendList] = useState<FriendInterface[]>([]);
  const [value, setValue] = useState<string>('Friends list');

  useEffect(() => {
    const getFriends = async () => {
      await axios.get("http://localhost:3001/user/friend/list")
      .then((res) => {
       setFriendList(res.data);
      }).catch(err => {
        setFriendList(testdata);
        console.error("Error in fetching friend list: ", err);
      })
    };
    const getRequests = async () => {
        await axios.get("http://localhost:3001/friend/requests")
        .then((res) => {
            setRequestFriendList(res.data);
        }).catch(err => {
            setRequestFriendList(testdata);
            console.error("Error in fetching friend requests: ", err);
        })
    };
    getFriends();
    getRequests();
}, []);



  const handleBlockFriend = async (name: string) => {
    console.log("blocked friend name: ", name);
    await axios.post("http://localhost:3001/user/block/friend", {name: name})
    .then((res) => {
        res.status === 201 && window.location.reload();
    })
    .catch((err) => {
        console.error("error when send post request to block friend: ", err);
    })
  };

  const handleAccepteFriend = async (name: string) => {
    console.log("accepted friend name: ", name);
    await axios.post("http://localhost:3001/accepte/friend", {name: name})
    .then((res) => {
        res.status === 201 && window.location.reload();
    })
    .catch((err) => {
        console.error("error when send post request to accepte friend: ", err);
    })
  }

  const rows = friendList.map((item) => (
    <Table.Tr key={item.name}>
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
    </Table.Tr>
  ));

  const requestRows = requestFriendList.map((item) => (
    <Table.Tr key={item.name}>
    <Table.Td>
      <Group gap="sm">
            <Avatar size={40} src={item.avatar} radius={40}/>
        <div>
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
          <Text fz="xs" c="dimmed">
            {item.status}    {/*this state was need to be real time*/}
          </Text>
        </div>
      </Group>
    </Table.Td>
     <Table.Td>
      <Button radius='lg' onClick={() => handleAccepteFriend(item.name)}>
        Accepte friend
      </Button>
    </Table.Td>
  </Table.Tr>
  ));

  const FriendsIcon = <IconFriends  size={60} strokeWidth={1.5} color={'#4078bf'}/>
  const FriendsOffIcon = <IconFriendsOff size={60} strokeWidth={1.5} color={'#4078bf'}/>

  const frindesNumber = rows.length;
  const blockedFriendsNumbre = 1;

  return (
    // <div className='relative flex '>
    <div >
            <div className="flex h-16 w-full items-center rounded-md bg-primary p-4">
                {/* {value === 'Friends list' && 
                (<div className='flex'>
                    <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">{frindesNumber}</h2>
                    {FriendsIcon}
                </div>)} */}
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
                        { label: 'Blocked Users', value: 'Blocked Users', disabled: (blockedFriendsNumbre === 0) },
                        { label: 'Friends Request', value: "Friends Request"},
                    ]}
                />
                {/* {value === 'Blocked Users' &&
                (<div className='flex'>
                    {FriendsOffIcon}
                    <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">{blockedFriendsNumbre}</h2>
                </div>)} */}
            </div>
    <ScrollArea h={200} type='never'>
        <Table >
            {value === 'Friends Request' ?
            <Table.Tbody>
                {Object.keys(requestFriendList).length ?
                    requestRows :
                    <Table.Tr>
                        <Table.Td>
                            <Blockquote color="gray" radius="xl" iconSize={33} mt="xl">
                                No Friend Requests
                            </Blockquote>
                        </Table.Td>
                    </Table.Tr>}
                    </Table.Tbody> : 
          (value === 'Friends list' ?
          (<Table.Tbody>
          {Object.keys(rows).length ?
            rows :
            <Table.Tr>
                <Table.Td>
            <Blockquote color="gray" radius="xl" iconSize={33} mt="xl">
              Add Freinds to shows them here
            </Blockquote>
            </Table.Td>
            </Table.Tr>}
            </Table.Tbody>) :
          (blockedFriendsNumbre &&
            <Table.Tbody>
            <BlockedFriends /> {/* fetch list of blocked friends here and pass it to this component becouse i need blocked friends number here */}
            </Table.Tbody>
            ))
        }
        </Table>
      </ScrollArea>
      </div>
    // </div>
  );
}

export default Frindes