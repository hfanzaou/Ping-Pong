import React from 'react';
import { Container, Flex, SimpleGrid } from '@mantine/core';
import Users  from './Users/Users'
import UserCard  from '../Profile/ProfileInfo/UserCard'
import image from "./assite/home.jpg"
import Header from '../../../Layout/Header/Header';

function Home({avatar} : {avatar: string}) {
  return (
    <div>
      <Header avatar={avatar}/>
      <div className='min-h-screen'>

      {/* <Container fluid px={0} size="30rem" bg="var(--mantine-color-blue-1)" > */}
        {/* <div className='h-full w-full'> */}
          <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 2 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'lg' }}
          >
            <img src={image} className='h-full'/>
            <Users />
          </SimpleGrid>
          {/* </div>  */}
      {/* </Container> */}
        </div>
    </div>
  );
}

export default Home