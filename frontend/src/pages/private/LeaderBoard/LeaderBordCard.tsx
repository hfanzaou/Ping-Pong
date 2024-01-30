import React from 'react';
import { Text, Card, Image } from '@mantine/core';
import leaderboardInterface from './Leaderboard';
import image1 from "./assite/lead1.png";
import image2 from "./assite/lead2.png";
import image3 from "./assite/lead3.png";

function LeaderbordCard({data, rank}: {data: leaderboardInterface, rank: number}) {
    const image = rank === 1 ? image1 : rank === 2 ? image2 : image3;

    return (
        <Card  radius="md" bg='dark'>
          <Card.Section mb={2}>
          <div className="relative">
              <img className='absolute bottom-0 right-0  max-h-8 min-w-8' src={image} alt="rank-image" />
              <Image
                  src={data?.avatar}
                  height={100}
                  alt="Norway"
              />
              </div>
          </Card.Section>
          <Text ta="center" fz="md" fw={800} c='indigo' mt="md">
              {data?.name}
          </Text>
          <Text ta='center' variant="default" mt="md" c='white'>
              Level {data?.level}
          </Text>
        </Card>
  );
}

export default LeaderbordCard;