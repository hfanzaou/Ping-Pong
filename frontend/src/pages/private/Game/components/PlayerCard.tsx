import React, { useEffect, useState } from 'react'
import { Card, Avatar, Text, Button } from '@mantine/core';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface PlayerCardProps {
    name: string | undefined;
    avatar: string | undefined;
    level: string | undefined;
    setUrlName: string;
}

const stats = [
  {value: '5', label: 'Wins'},
  {value: '7', label: 'Total'},
  {value: '3', label: 'losses'},
];

function PlayerCard({name, avatar, level, setUrlName} : PlayerCardProps) {
    const [userName, setUserName] = useState<string| undefined>();
    const [userLevel, setLevel] = useState<string>();

    useEffect(() => {
        if (name !== undefined && level !== undefined) {
            setLevel(level);
            setUserName(name);
        } else {
            setLevel("--");
            setUserName("----");
        }
    }, [name, level]);

  return (
     <Card p={10} h={250} w={170} style={{backgroundColor: 'rgb(31 41 55)', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)'}} radius={10}>
      <Avatar
        src={avatar}
        size={75}
        radius={75}
        mx="auto"
        style={{border: '2px solid gray'}}
        />
      <Text  ta="center" fz='xl' fw={800} mt="md" mb='md' c='dimmed' style={{textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
        {userName}
      </Text>      <Text ta="center" c="indigo" fz="sm" mb='md' style={{textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', fontWeight: 'bold'}}>

      {"level "  + userLevel}
      </Text>
      <div className='flex justify-center items-centerw-12'>
        <Link to={`/UserProfile?name=${userName}`}>
            <Button radius="md" size="md" color='gray'>
                show profile
            </Button>
        </Link>
      </div> 
    </Card>
  );
}

export default PlayerCard;
