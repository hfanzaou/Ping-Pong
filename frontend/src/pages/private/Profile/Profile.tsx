import React, { useState } from 'react'
import { Container, MantineProvider, SimpleGrid, createTheme} from '@mantine/core'
import UserCard  from './ProfileInfo/UserCard'
import Friends from './Friends/Friends'
import MatchHistory from './MatchHistory/MatchHistory'
import Achievements from './Achievements/Achievement'
import './profile.css'
import cx from 'clsx'

const theme = createTheme({
  components: {
    Container: Container.extend({
      classNames: (_, { size }) => ({
        root: cx({ ["responsiveContainer"]: size === 'responsive' }),
      }),
    }),
  },
});

export function ProfileSections() {
    return (
      <div>
        <SimpleGrid
              cols={{ base: 1, sm: 1, lg: 2 }}
              spacing={{ base: 10, sm: 'xl' }}
              verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          <UserCard />
          <Achievements />
        </SimpleGrid>
        <SimpleGrid 
        cols={{ base: 1, sm: 2, lg: 2 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          <MatchHistory />
          <Friends />
          {/* <Friends />
          <MatchHistory /> */}
        </SimpleGrid>
      </div>
    );

  // return (
  //     <SimpleGrid>
  //       <UserCard />
  //       <Grid gutter="md">
  //         <Grid.Col>
  //           <Achievements/>
  //         </Grid.Col>
  //         <Grid.Col >
  //           <MatchHistory />
  //           {/* <Friends /> */}
  //         </Grid.Col>
  //         {/* <Grid.Col >
  //         <MatchHistory />
  //         </Grid.Col> */}
  //       </Grid>
  //       <Friends />
  //     </SimpleGrid>
  // );
}

function Profile() {
    return (
      // fluid
    //   <MantineProvider theme={theme}>
    // <Container fluid px={0} size="30rem" bg="var(--mantine-color-blue-1)" className='h-full'>

    //   <Container fluid  size="responsive" bg="var(--mantine-color-blue-1)" className='h-full'>
        <div className='h-full m-8 b-8 bg-neutral-500'>
            <ProfileSections />
        </div>
    //   </Container>
    //   </MantineProvider>
    );
}

export default Profile