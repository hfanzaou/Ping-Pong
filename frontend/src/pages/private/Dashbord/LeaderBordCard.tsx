import React from 'react';
import { Avatar, Text, Button, Paper, Card, Image } from '@mantine/core';
import image from "./test.png";
import leaderboardInterface from './Leaderboard';

function LeaderbordCard({data}: {data: leaderboardInterface}) {
  return (
    <Card  radius="md" bg={'gray'}>
        <Card.Section mb={2}>
            <Image
                src={data?.avatar}
                height={100}
                alt="Norway"
            />
        </Card.Section>
        <Text ta="center" fz="lg" fw={500} mt="md">
            {data?.name}
        </Text>
        <Text ta='center' variant="default"  mt="md">
            #{data?.level}
        </Text>
    </Card>
  );
}
export default LeaderbordCard;
