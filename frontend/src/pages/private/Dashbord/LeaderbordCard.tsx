import React from 'react';
import { Avatar, Text, Button, Paper } from '@mantine/core';
import image from "./test.png";

function LeaderbordCard() {
  return (
    <Paper radius="md" bg={'transparent'} >
      <Avatar
        src={image}
        size={120}
        radius={120}
        mx="auto"
      />
      <Text ta="center" fz="lg" fw={500} mt="md">
        Jane Fingerlicker
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        Level 2
      </Text>
    <Text ta='center' variant="default"  mt="md">
        #1
    </Text>
    </Paper>
  );
}
export default LeaderbordCard;