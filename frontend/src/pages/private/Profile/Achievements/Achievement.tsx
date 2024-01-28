import React, { useEffect, useState } from 'react';
import { SimpleGrid } from '@mantine/core';
import axios from 'axios';
import AchievementsCards from './AchievementCards';
import data from './AllAchievement.json';
import AchievementsInterface from './AchievementInterface';

function  Achievement() {
    const [achievements, setAchievements] = useState<AchievementsInterface>({});

    const getAchievements = async () => {
        await axios.get("user/achievements")
        .then((res) => {
            console.log("Achievement from res: ", res.data);
            setAchievements(res.data);
        })
        .catch((err) => {
            console.error("error in fetching Matchs History: ", err );
        })
    };

    useEffect(() => {
        getAchievements();
    }, []);

    data[0].type = achievements['firstMatch'];
    data[1].type = achievements['firstFriend'];
    data[2].type = achievements['lead1'];
    data[3].type = achievements['lead2'];
    data[4].type = achievements['lead3'];

    const achievementsData = data.map((item) => (
        <div key={item.name}>
            <AchievementsCards type={item.type} name={item.name} title={item.title} image={item.id}/>        
        </div>
    ));
  
    return (
        <div className='mx-2 mb-4'>
            <h2 className="mb-4 text-3xl font-medium leading-tight text-slate-100">
                Your Achievements
            </h2>
            <SimpleGrid 
                cols={{ base: 3, md: 3, lg: 5, xl: 5 }}
            >
                {achievementsData}
            </SimpleGrid>
        </div>
    );
}

export default Achievement