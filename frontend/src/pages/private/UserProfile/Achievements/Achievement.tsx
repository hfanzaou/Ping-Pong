import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Table, Group, Text, Menu, rem, Image, Card, Container, SimpleGrid } from '@mantine/core';
import { IconMessages, IconTrash} from '@tabler/icons-react';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import {MdChildFriendly} from 'react-icons/md';
import AchievementsCards from './AchievementCards';
import data from './AllAchievement.json';
// import testDataAchievement from './testDataAchievement.json';
import AchievementsInterface from './AchievementInterface';
import axios from 'axios';


{/*
    Achievement :
    [achievement name]: {achievement description}
    [achievement name]: Taked when play the first game
    [achievement name]: Taked when win in 3 game and go to level 1
    [achievement name]: Taked when win a game without damage [45 - 0]
    [achievement name]: Taked when add first friend
    [achievement name]: Taked when have 3 friends
*/}


function  Achievement({achievement}: {achievement: AchievementsInterface}) {
// const [achievementt, setAchievement] = useState<AchievementsInterface[]>(achievement);

data[0].type = achievement?.achievement1;
data[1].type = achievement?.achievement2;
data[2].type = achievement?.achievement3;
data[3].type = achievement?.achievement4;
data[4].type = achievement?.achievement5;

    const matches = data.map((item) => (
        <div key={item.name}>
            <AchievementsCards type={item.type} name={item.name} title={item.title} image={item.id}/>        
        </div>
  ));
  
  return (
    <div className='mb-4 pb-4'>
      <div className="flex h-16 w-full items-center rounded-md bg-primary p-4">
          <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">Your Achievement</h2>
      </div>
      <SimpleGrid 
        cols={{ base: 3, sm: 3, lg: 4 }}
        // verticalSpacing={{ base: 'sm', sm: 'sm', lg: 'sm' }}
        //     spacing={ {base: 10, sm: 'xl', lg: 'xl'} }
    >
         {matches}
      </SimpleGrid>
    {/* <div className='relative flex items-center'>
        <div className='w-full h-full space-x-5'>
        {matches}
        </div>
    </div> */}
    </div>
  );
}

export default Achievement
