import React from 'react';
import { Container, Flex, SimpleGrid } from '@mantine/core';
import Users  from './Users/Users'
import UserCard  from '../Profile/ProfileInfo/UserCard'
// import image from "../../../4304494.jpg"

function Home() {
  return (
    <Container fluid  size="responsive" bg="var(--mantine-color-blue-1)" className='min-h-screen'>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 2 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
      {/* <img src={image}/> */}
        <UserCard/>
        <Users />
      </SimpleGrid>
    </Container>
  );
}

export default Home