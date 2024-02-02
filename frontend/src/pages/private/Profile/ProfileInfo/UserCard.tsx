import React, { useEffect, useState } from 'react'
import { Card, Avatar, Text, Group, Menu, rem } from '@mantine/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IconUserCircle } from '@tabler/icons-react';

interface UserCardInterface {
    name: string;
    avatar: string;
    level: number;
    win: number;
    loss: number;
}

function UserCard({setUrlName, avatar} : {setUrlName: Function, avatar: string }) {
    const [data, setData] = useState<UserCardInterface>();

    const stats = [
      {value: data?.win, label: 'Wins'},
      {value: data?.win && (data?.win) + (data?.loss), label: 'Played game'},
      {value: data?.loss, label: 'losses'},
    ];

    const getUserNmae = async () => {
        await axios.get("user/name")
        .then((res) => {
            setData(res.data);
        })
        .catch((err) => {
            console.log("Error in geting data in edit profile :", err);
        })
    };

    useEffect(() => {
          getUserNmae();
    }, []);

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

    const  handelShowProfile = () => {
        setUrlName(data?.name);
    }

  return (
        <Card p={0} className='h-full w-full space-y-5' style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg">
            <div dir="rtl" className="relative">
                <Avatar
                    src={avatar}
                    size='35vh'
                    radius={230}
                    m="auto"
                    mt={12}
                />
                <Menu position='left-start' offset={2}>
                    <Menu.Target >
                        <button className="absolute top-1 start-0 m-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 512 512">
                                <path fill="#74C0FC" d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"/>
                            </svg>
                        </button>
                    </Menu.Target>
                    <Menu.Dropdown bg='dark' mt={25}>
                        <Menu.Item
                            c='blue'
                            onClick={() => handelShowProfile()}
                        >
                            <Link to={`/UserProfile?name=${data?.name}`}>
                                <div className='flex items-center space-x-2'>
                                    <IconUserCircle style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                    <div>Show public Profile</div>
                                </div>
                            </Link>
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>
            <div>
                <Text ta="center" fz='xl' fw={800} mt="md" mb='md' c='dimmed'>
                    {data?.name}
                </Text>
                <Text ta="center" c="indigo" fz="sm">
                    {"level "  + data?.level}
                </Text>
            </div>
            <Group mt="md" justify="center" gap={30}>
                {items}
            </Group>
        </Card>
    );
}

export default UserCard;