import React, { useEffect, useState } from 'react';
import { Avatar, Table, Group, Text, Menu, rem, ScrollArea, Blockquote, SegmentedControl, Button, Container } from '@mantine/core';
import { IconMessages, IconTrash, IconFriends, IconFriendsOff, IconUserCircle} from '@tabler/icons-react';
import FriendInterface from './FriendsInterface';

import testdata from './FriendsList.json';
import axios from 'axios';
import BlockedFriends from './BlockedFriends';
import { Link } from 'react-router-dom';
// import { Cookies } from 'react-cookie';

// import Cookies from 'js-cookie'


function  Frindes({setUserName}: {setUserName: any}) {
  const [friendList, setFriendList] = useState<FriendInterface[]>([]);
  const [requestFriendList, setRequestFriendList] = useState<FriendInterface[]>([]); // this is for the request list [not implemented yet]
  const [searchFriendList, setSearchFriendList] = useState<FriendInterface[]>([]);
  const [value, setValue] = useState<string>('Friends list');

  const handelShowProfile = (name: string) => {
        window.location.href = '/'+name+'/public/profile';
        // window.location.reload();
  };
  
  useEffect(() => {
      const getFriends = async () => {
      await axios.get("user/friend/list")
      .then((res) => {
       setFriendList(res.data);
      }).catch(err => {
        // setFriendList(testdata);
        console.error("Error in fetching friend list: ", err);
      })
    };
    const getRequests = async () => {
        await axios.get("user/friend/requests")
        .then((res) => {
            setRequestFriendList(res.data);
        }).catch(err => {
            // setRequestFriendList(testdata);
            console.error("Error in fetching friend requests: ", err);
        })
    };
    getFriends();
    getRequests();
}, []);

  const handleBlockUser = async (name: string) => {
    console.log("blocked friend name: ", name);
    await axios.post("user/block", {name: name})
    .then((res) => {
        res.status === 201 && window.location.reload();
    })
    .catch((err) => {
        console.error("error when send post request to block friend: ", err);
    })
  };

  const handleAccepteFriend = async (name: string) => {
    console.log("accepted friend name: ", name);
    await axios.post("user/accept/friend", {name: name})
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
                    Show Profile
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
      <Button radius='xl' color='gray' onClick={() => handleAccepteFriend(item.name)}>
        Accept friend
      </Button>
    </Table.Td>
  </Table.Tr>
  ));

  const frindesNumber = rows.length;
  const blockedFriendsNumbre = 1;

  return (
    // <div className='relative flex '>
    // <Container  className='h-full w-full'>
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
                        { label: 'Blocked Users', value: 'Blocked Users'},
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
      {/* </Container> */}
  </div>
  );
}

export default Frindes