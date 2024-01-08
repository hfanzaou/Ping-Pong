import React, { useEffect, useState } from 'react'
import { Card, Avatar, Text, Group, Button, SimpleGrid } from '@mantine/core';
import classes from './UserCard.module.css';
import axios from 'axios';
// import sectionimage from '../../../../4304494.jpg'
import sectionimage from '../../Home/assite/bg.gif'
import { Link } from 'react-router-dom';


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

function UserCard({setUrlName, avatar} : {setUrlName: Function, avatar: string }) {
    const [userName, setUserName] = useState<string| undefined>();
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

    const handleClick = () => {
        setUrlName(userName);
        // <Link to={'/'+ window.location.pathname.split("/")[1] +'/public/profile'}></Link>
        // window.location.href = '/'+userName+'/public/profile';
    }

  return (
    <div>

    <Card style={{backgroundColor: 'transparent'}}   radius="md" className={classes.card}>
      <Card.Section
        h={50}
        >
            {/* <img className='h-full w-full' src={sectionimage}/> */}
        </Card.Section>
      <Avatar
        src={avatar}
        size={200}
        radius={160}
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
    </Card>
      <div className='flex justify-center items-centerw-12'>
        <Button radius="md" size="md" color='gray' onClick={handleClick}>
        {/* <Link to={'/'+userName+'/public/profile'}> */}
        <Link to={`/UserProfile?name=${userName}`}>
            show your public profile
        </Link>
        </Button>
      </div>
    </div>
  );
}

export default UserCard;