import React, { useEffect, useState } from 'react'
import { Card, Avatar, Text, Group, Menu, rem } from '@mantine/core';
import axios from 'axios';
// import sectionimage from '../../../../4304494.jpg'
import FriendshipButton from '../../Home/Users/FriendshipButton';
import { IconMessages, IconTrash, IconUserCircle } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
// import { Cookies } from 'react-cookie';

    interface UserCardProps {
        username: string;
        avatar: string;
        level: number;
        win: number;
        loss: number;
    }

function UserCard({usercard, handleRequest, friendShip}: {usercard: UserCardProps, handleRequest: any, friendShip: string}) {
    const [userName, setUserName] = useState<string>();
    
    const stats = [
        {value: usercard?.win, label: 'Wins'},
        {value: (usercard?.win) + (usercard?.loss), label: 'Played game'},
        {value: usercard?.loss, label: 'losses'},
      ];

    useEffect(() => { // Just to check if the same user profile or not to show the friendship button or not
        const getUserNmae = async () => {
            await axios.get("user/name")
            .then((res) => {
                console.log(res.data.name);
                setUserName(res.data.name);
            })
            .catch((err) => {
                console.log("Error in geting data in edit profile :", err);
            })
        };
        getUserNmae();
    }, []);


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
    
    const handleSendMessage = (name: string) => {
        // setReceverName(name);
        open();
    };


    const items = stats.map((stat) => (
        <div key={stat.label} className={stat.label !== 'Played game' ? "mb-12" : ""}>
          <Text ta="center" fz="lg" fw={500} c={(stat.label === 'Played game'? "dimmed" : stat.label === 'Wins' ? 'green': 'red')}>
            {stat.value}
          </Text>
          <Text ta="center" fz="sm" lh={1} c={(stat.label === 'Played game'? "dimmed" : stat.label === 'Wins' ? 'green': 'red')}>
            {stat.label}
          </Text>
        </div>
      ));

  return (
    <Card p={2} style={{backgroundColor: 'rgb(31 41 55)'}}    radius="lg">
    {/* <Card.Section
      h={250}
      style={{
        backgroundImage: `url(${avatar})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
      /> */}
    <div dir="rtl" className="relative">
        {/* <div className="relative flex items-center justify-center"> */}

        <Avatar
            src={usercard?.avatar}
            size={250}
            radius={250}
            m="auto"
            mt={12}
            />
            <Menu position='right-start' offset={2}>
                <Menu.Target >

            <button className="absolute top-1 start-0 m-2">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 512 512">
                <path fill="#74C0FC" d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"/>
            </svg>
            </button>
                </Menu.Target>
                <Menu.Dropdown bg='gray' mt={25}>
                    {/* <Menu.Item
                        onClick={() => handleSendMessage(usercard?.username)}
                        leftSection={<IconMessages style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    >
                        Send message
                    </Menu.Item> */}
                    <Menu.Item
                        onClick={() => handleBlockUser(usercard?.username)}
                        leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    >
                        Block user
                    </Menu.Item>
                        {usercard?.username !== userName &&    // if the user is not the same user profile show the friendship button
                    <Menu.Item>
                        {/* <div className='flex justify-center items-center mt-2'> */}
                                <FriendshipButton name={usercard?.username} friendship={friendShip} handleRequest={handleRequest}/>
                        {/* </div> */}
                    </Menu.Item>
                        }
                </Menu.Dropdown>
            </Menu>
            </div>
      {/* </div> */}
    <Text  ta="center" fz='xl' fw={800} mt="md" mb='md' c='dimmed'>

      {usercard?.username}
    </Text>
    <Text ta="center" c="indigo" fz="sm">
    {"level "  + usercard?.level}
    </Text>
    <Group mt="md" justify="center" gap={30}>
      {items}
    </Group>
    </Card>
  );
}

export default UserCard;