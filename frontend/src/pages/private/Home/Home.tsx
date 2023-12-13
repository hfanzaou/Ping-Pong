import React from 'react';
import { Container, Flex, SimpleGrid } from '@mantine/core';
import Users  from './Users/Users'
import UserCard  from '../Profile/ProfileInfo/UserCard'
import image from "../../../4304494.jpg"

function Home() {
  return (
    <Container fluid px={0} size="30rem" bg="var(--mantine-color-blue-1)" className='h-full'>
     {/* <div className='h-full w-full'> */}
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 2 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'lg' }}
        >
      <img src={image} className='h-full'/>
        {/* <UserCard/> */}
        {/* <UserCard/> */}
        <Users />
      </SimpleGrid>
          {/* </div>  */}
      </Container>
  );
}

export default Home