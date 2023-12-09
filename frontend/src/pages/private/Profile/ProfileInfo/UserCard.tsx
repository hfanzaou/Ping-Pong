import React from 'react'
import { Card, Avatar, Text, Group, Button } from '@mantine/core';
import classes from './UserCard.module.css';

const userInfo = {
  firstName: 'Rahhal',
  lastName: 'Rizqy',
  uniqueName: 'rarahhal', 
  email: 'rizqyrahhal8@gmail.com'
}

const stats = [
  {value: '5', label: 'Wins'},
  {value: '3', label: 'losses'},
  {value: '2', label: 'level'}, // when wine 3 matches move from level to next level
  
  // { value: '34K', label: 'Followers' },
  // { value: '187', label: 'Follows' },
  // { value: '1.6K', label: 'Posts' },
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
  <Card style={{backgroundColor: 'transparent'}} withBorder  padding="md" radius="md" className={classes.card}>
      <Card.Section
        h={140}
        style={{
          backgroundImage:
          'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)',
        }}
        />
      <Avatar
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
        size={80}
        radius={80}
        mx="auto"
        mt={-30}
        className={classes.avatar}
        />
      <Text ta="center" fz="lg" fw={500} mt="sm">
      {userInfo.firstName + " " + userInfo.lastName} 
      </Text>
      <Text ta="center" fz="sm" c="dimmed">
        {userInfo.uniqueName}
      </Text>
      <Group mt="md" justify="center" gap={30}>
        {items}
      </Group>
      <Button fullWidth radius="md" mt="xl" size="md" variant="default">
        {/* Follow */}
      </Button>
    </Card>
  );
}

export default UserCardImage;