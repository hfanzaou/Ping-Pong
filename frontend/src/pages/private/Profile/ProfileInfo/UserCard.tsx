import React, { useEffect, useState } from 'react'
import { Card, Avatar, Text, Group, Button, SimpleGrid } from '@mantine/core';
import classes from './UserCard.module.css';
import axios from 'axios';
import sectionimage from '../../../../4304494.jpg'

const userInfo = {
    userName: 'rarahhal',
    avatar: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    email: 'rizqyrahhal8@gmail.com',
    level: '1',   // when wine 3 matches move from level to next level
    win: 5,
    losses: 3
}

interface UserCardProps {
    userName: string;
    avatar: string;
    email: string;
    level: string;
    win: number;
    losses: number;
}

const stats = [
  {value: '5', label: 'Wins'},
  {value: '7', label: 'Total'},
  {value: '3', label: 'losses'},
];

function UserCard() {

    const [image, setImage] = useState<string| undefined>();
    const [userName, setUserName] = useState<string| undefined>();
    useEffect(() => {
        const getUserAvatar = async () => {
          {/* change to get http://localhost:3000/user/avatar*/}
          await axios.get("http://localhost:3001/user/avatar")
          .then((res) => {
              setImage(res.data.avatar);
          })
          .catch((err) => {
            console.log("Error in geting data in edit profile :", err);
          })
        };
        const getUserNmae = async () => {
            await axios.get("http://localhost:3001/user/name")
            .then((res) => {
                console.log(res.data.name);
                setUserName(res.data.name);
            })
            .catch((err) => {
              console.log("Error in geting data in edit profile :", err);
            })
          };
          getUserNmae();
        getUserAvatar();
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

  return (
  <Card style={{backgroundColor: 'transparent'}}  padding="md" radius="md" className={classes.card}>
      <Card.Section
        h={150}
        >
            <img className='h-full w-full' src={sectionimage}/>
        </Card.Section>
      <Avatar
        src={image}
        size={100}
        radius={80}
        mx="auto"
        mt={-30}
        className={classes.avatar}
        />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {userName}
      </Text>
      <Text ta="center" fz="sm">
      {"level "  + userInfo.level}
      </Text>
      <Group mt="md" justify="center" gap={30}>
        {items}
      </Group>
      {/* <Button fullWidth radius="md" mt="xl" size="md" variant="default">
        Life is like an npm install – you never know what you are going to get.
      </Button> */}
  </Card>
  );
}

export default UserCard;