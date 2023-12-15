import React, { useState } from 'react'
import { Container, MantineProvider, SimpleGrid, createTheme} from '@mantine/core'
import UserCard  from './ProfileInfo/UserCard'
import Friends from './Friends/Friends'
import MatchHistory from './MatchHistory/MatchHistory'
import Achievements from './Achievements/Achievement'
import './Profile.css'
import cx from 'clsx'
import Header from '../../../Layout/Header/Header'

const theme = createTheme({
  components: {
    Container: Container.extend({
      classNames: (_, { size }) => ({
        root: cx({ ["responsiveContainer"]: size === 'responsive' }),
      }),
    }),
  },
});

export function ProfileSections({avatar}: {avatar: string}) {
    return (
      <div>
        <SimpleGrid
              cols={{ base: 1, sm: 1, lg: 2 }}
              spacing={{ base: 10, sm: 'xl' }}
              verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          <UserCard avatar={avatar} />
          <Achievements />
        </SimpleGrid>
        <SimpleGrid 
        cols={{ base: 1, sm: 2, lg: 2 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          <MatchHistory />
          <Friends />
        </SimpleGrid>
      </div>
    );
}

function Profile({avatar} : {avatar: string }) {
    return (
      // fluid
    //   <MantineProvider theme={theme}>
    // <Container fluid px={0} size="30rem" bg="var(--mantine-color-blue-1)" className='h-full'>

    //   <Container fluid  size="responsive" bg="var(--mantine-color-blue-1)" className='h-full'>
        <div>

            <Header avatar={avatar}/>
        <div className='h-full ml=15 m-8 b-8'>
            <ProfileSections avatar={avatar} />
        </div>
        </div>
    //   </Container>
    //   </MantineProvider>
    );
}

export default Profile