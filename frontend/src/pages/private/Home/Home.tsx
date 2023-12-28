import React from 'react';
import { BackgroundImage, Container, Flex, SimpleGrid } from '@mantine/core';
import Users  from './Users/Users'
import UserCard  from '../Profile/ProfileInfo/UserCard'
import image from "./assite/bg.gif"
import Header from '../../../Layout/Header/Header';
import Footer from '../../../Layout/Footer/Footer';


function Home({avatar} : {avatar: string}) {
  return (
    <div className='h-full' >
        {/* <div className='h-full  ml-8 bl-8 mr-8 pr-8 raduis-5 rounded-full'> */}
            <Header avatar={avatar}/>
        {/* </div> */}

      {/* <Container fluid px={0} size="30rem" bg="var(--mantine-color-blue-1)" > */}
        <div className='h-full ml-15 m-8 b-8'>
          <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 2 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'lg' }}
          >
            <img src={image} />
            <Users />
          </SimpleGrid>
          </div>
    <Footer/>
      {/* </Container> */}
        </div>
  );
}

export default Home