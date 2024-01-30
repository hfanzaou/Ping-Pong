import React from 'react';
import { SimpleGrid } from '@mantine/core';
import data from './AllAchievement.json';
import AchievementsCards from './AchievementCards';
import AchievementsInterface from './AchievementInterface';

function  Achievement({achievement}: {achievement: AchievementsInterface}) {
    data[0].type = achievement?.firstMatch;
    data[1].type = achievement?.firstFriend;
    data[2].type = achievement?.lead1;
    data[3].type = achievement?.lead2;
    data[4].type = achievement?.lead3;

    const achievementsData = data.map((item) => (
        <div key={item.name}>
            <AchievementsCards type={item.type} name={item.name} title={item.title} image={item.image}/>        
        </div>
    ));
  
    return (
        <div className='mx-2 mb-4'>
            <h2 className="mb-4 text-3xl font-medium leading-tight text-slate-100">Achievements</h2>
            <SimpleGrid 
                cols={{ base: 3, md: 3, lg: 5, xl: 5 }}
            >
                {achievementsData}
            </SimpleGrid>
        </div>
    );
}

export default Achievement
