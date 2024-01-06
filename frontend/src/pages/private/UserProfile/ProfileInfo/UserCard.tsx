import React, { useEffect, useState } from 'react'
import { Card, Avatar, Text, Group, Button, SimpleGrid } from '@mantine/core';
import classes from './UserCard.module.css';
import axios from 'axios';
// import sectionimage from '../../../../4304494.jpg'
import sectionimage from '../../Home/assite/bg.gif'
import FriendshipButton from '../../Home/Users/FriendshipButton';
// import { Cookies } from 'react-cookie';

const userInfo = {
    userName: 'rarahhal',
    avatar: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    email: 'rizqyrahhal8@gmail.com',
    level: '1',   // when wine 3 matches move from level to next level
    win: 5,
    losses: 3
}

interface UserCardProps {
        username: string;
        avatar: string;
        level: number;
        win: number;
        losses: number;
}

const stats = [
  {value: '5', label: 'Wins'},
  {value: '7', label: 'Total'},
  {value: '3', label: 'losses'},
];

function UserCard({usercard, handleRequest, friendShip}: {usercard: UserCardProps, handleRequest: any, friendShip: string}) {
    const [userName, setUserName] = useState<string>();
    useEffect(() => {

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
    const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text ta="center" fz="lg" fw={500}>
        {stat.value}
      </Text>
      <Text ta="center" fz="sm" c="dimmed" lh={1}>
        {stat.label}
      </Text>
    </div>
  ));

        // const name = window.location.pathname.split("/")[1];

  return (
    <div >

  <Card style={{backgroundColor: 'transparent'}} radius="md" className={classes.card}>
      <Card.Section
        h={40}
        >
            {/* <img className='h-full w-full' src={sectionimage}/> */}
        </Card.Section>
      <Avatar
        src={usercard?.avatar}
        size={200}
        radius={160}
        mx="auto"
        mt={-30}
        className={classes.avatar}
        />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {usercard?.username}
      </Text>
      <Text ta="center" fz="sm">
      {"level "  + usercard?.level}
      </Text>
      <Group mt="md" justify="center" gap={30}>
        {items}
      </Group>
  </Card>
    {usercard?.username !== userName &&
      <div className='flex justify-center items-center mt-2'>
            <FriendshipButton name={window.location.pathname.split("/")[1]} friendship={friendShip} handleRequest={handleRequest}/>
      </div>
    }
    </div>
  );
}

export default UserCard;