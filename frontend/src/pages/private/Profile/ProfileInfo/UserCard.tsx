import React from 'react'
import { Card, Avatar, Text, Group, Button, SimpleGrid } from '@mantine/core';
import classes from './UserCard.module.css';

const userInfo = {
  userName: 'rarahhal',
  email: 'rizqyrahhal8@gmail.com',
  level: '1'   // when wine 3 matches move from level to next level
}

const stats = [
  {value: '5', label: 'Wins'},
  {value: '7', label: 'Total'},
  {value: '3', label: 'losses'},
];

function UserCardImage() {
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text ta="center" fz="lg" fw={500}>
        {stat.value}
      </Text>
      <Text ta="center" fz="sm" c="dimmed" lh={1}>
        {stat.label}
      </Text>
    </div>
  ));

  return (
  <Card style={{backgroundColor: 'transparent'}}  padding="md" radius="md" className={classes.card}>
      <div>
      <Card.Section
        h={200}
        style={{
          backgroundImage:
          'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)',
        }}
        />
      <Avatar
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
        size={100}
        radius={80}
        mx="auto"
        mt={-30}
        className={classes.avatar}
        />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {userInfo.userName}
      </Text>
      <Text ta="center" fz="sm">
      {"level "  + userInfo.level}
      </Text>
      <Group mt="md" justify="center" gap={30}>
        {items}
      </Group>
      </div>
      {/* <Button fullWidth radius="md" mt="xl" size="md" variant="default">
        Life is like an npm install – you never know what you are going to get.
      </Button> */}
  </Card>
  );
}

export default UserCardImage;