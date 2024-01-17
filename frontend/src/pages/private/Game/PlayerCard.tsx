import React, { useEffect, useState } from 'react'
import { Card, Avatar, Text, Group, Button, SimpleGrid } from '@mantine/core';
import axios from 'axios';
// import sectionimage from '../../../../4304494.jpg'
import sectionimage from '../Profile/ProfileInfo/avatar-10.png';
import { Link } from 'react-router-dom';


const userInfo = {
    userName: 'rarahhal',
    avatar: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    email: 'rizqyrahhal8@gmail.com',
    level: '1',   // when wine 3 matches move from level to next level
    win: 5,
    losses: 3
}

interface PlayerCardProps {
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

function PlayerCard({name, avatar, level} : {name: string | number | undefined, avatar: string | undefined, level: string | undefined}) {
    const [userName, setUserName] = useState<string| undefined>();
    const [userLevel, setLevel] = useState<string>();
    useEffect(() => {
       
        const getUserNmae = async () => {
            await axios.get("user/name")
            .then((res) => {
                console.log(res.data.name);
                setUserName(res.data.name);
                setLevel(res.data.level)
            })
            .catch((err) => {
              console.log("Error in geting data in edit profile :", err);
            })
          };
          console.log(name)
          if (name === 0)
            getUserNmae();
          else if (typeof name === 'string')
          {
            setLevel(level);
            setUserName(name);
          }
          else
          {
            setLevel("--");
            setUserName("----");
          }
      }, [name, level]);

  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text ta="center" fz="lg" fw={500} c={(stat.label === 'Total'? "dimmed" : stat.label === 'Wins' ? 'green': 'red')}>
        {stat.value}
      </Text>
      <Text ta="center" fz="sm" lh={1} c={(stat.label === 'Total'? "dimmed" : stat.label === 'Wins' ? 'green': 'red')}>
        {stat.label}
      </Text>
    </div>
  ));

    const handleClick = () => {
        // setUrlName(userName);
        // <Link to={'/'+ window.location.pathname.split("/")[1] +'/public/profile'}></Link>
        // window.location.href = '/'+userName+'/public/profile';
    }

  return (
    //  h-[515px]
    // <div className='p-2  w-[250px]  rounded-lg bg-gray-800'>
     <Card p={1} h={250} w={100} style={{backgroundColor: 'rgb(31 41 55)'}}    radius='20'>
      {/* <Card.Section
        h={250}
        style={{
          backgroundImage: `url(${sectionimage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
        >
        </Card.Section> */}
      <Avatar
        src={avatar}
        size={75}
        radius={75}
        mx="auto"
        // mt={-30}
        />
      <Text  ta="center" fz='xl' fw={800} mt="md" mb='md' c='dimmed'>

        {userName}
      </Text>
      <Text ta="center" c="indigo" fz="sm">
      {"level "  + userLevel}
      </Text>
      {/* <Group mt="md" justify="center" gap={30}>
        {items}
      </Group> */}
      <div className='flex justify-center items-centerw-12'>
        <Button radius="md" size="md" color='gray' onClick={handleClick}>
        <Link to={`/UserProfile?name=${userName}`}>
            show your public profile
        </Link>
        </Button>
      </div> 
    </Card>
    //   </div>
  );
}

export default PlayerCard;