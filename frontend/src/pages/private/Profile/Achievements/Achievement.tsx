import React, { useRef } from 'react';
import { Avatar, Table, Group, Text, Menu, rem, Image, Card, Container, SimpleGrid } from '@mantine/core';
import { IconMessages, IconTrash} from '@tabler/icons-react';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import {MdChildFriendly} from 'react-icons/md';
import AchievementsCards from './AchievementCards';
import data from './AllAchievement.json'


{/*
    Achievement :
    [achievement name]: {achievement description}
    [achievement name]: Taked when play the first game
    [achievement name]: Taked when win in 3 game and go to level 1 
    [achievement name]: Taked when win a game without damage [45 - 0]
    [achievement name]: Taked when add first friend
    [achievement name]: Taked when have 3 friends
*/}


function  Achievement() {

// take the isTaked {array} items from server add it to allAchievmentdata

  const matches = data.map((item) => (
    <div key={item.name}>
        <AchievementsCards isTaked={item.type} name={item.name} title={item.title} image={item.image}/> 
    </div>
  ));

  return (
    <Container className='w-full h-full'>

      <div className="flex h-16 w-full items-center rounded-md bg-primary p-4">
          <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">Your Achievement</h2>
      </div>
      <SimpleGrid cols={3}>
        {matches}
      </SimpleGrid>
    {/* <div className='relative flex items-center'>
        <div className='w-full h-full space-x-5'>
          {matches}
        </div>
    </div> */}
    </Container>
  );
}

export default Achievement
