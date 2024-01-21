import React from 'react';
import { Avatar, Text, Button, Paper } from '@mantine/core';
import image from "./test.png";
import leaderboardInterface from './Leaderboard';

function LeaderbordCard({data}: {data: leaderboardInterface}) {
  return (
    <Paper radius="md" bg={'gray'}>
      <Avatar
        src={data?.avatar}
        size={120}
        radius={120}
        mx="auto"
      />
      <Text ta="center" fz="lg" fw={500} mt="md">
        {data?.name}
      </Text>
      {/* <Text ta="center" c="dimmed" fz="sm">
        Level 2
      </Text> */}
    <Text ta='center' variant="default"  mt="md">
        #{data?.level}
    </Text>
    </Paper>
  );
}
export default LeaderbordCard;