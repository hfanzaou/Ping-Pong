import React, { useEffect, useState } from 'react'
import { Card, Avatar, Text, Group, Menu, rem } from '@mantine/core';
import axios from 'axios';
// import sectionimage from '../../../../4304494.jpg'
import FriendshipButton from '../../../../componenet/FriendshipButton';
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
    
    const stats = [
        {value: usercard?.win, label: 'Wins'},
        {value: (usercard?.win) + (usercard?.loss), label: 'Played game'},
        {value: usercard?.loss, label: 'losses'},
      ];


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
        <Avatar
            src={usercard?.avatar}
            size={250}
            radius={250}
            m="auto"
            mt={12}
            />
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