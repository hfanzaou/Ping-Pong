import React, { useState } from 'react'
import { Container, Grid, SimpleGrid} from '@mantine/core'
import UserCard  from './ProfileInfo/UserCard'
import Friends from './Friends/Friends'
import MatchHistory from './MatchHistory/MatchHistory'
import Achievements from './Achievements/Achievements'

export function ProfileSections() {
    return (
      <div>
        <SimpleGrid>
          <UserCard />
          <Achievements />
        </SimpleGrid>
        <SimpleGrid 
        cols={{ base: 1, sm: 2, lg: 2 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          <Friends />
          <MatchHistory />
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
      <Container fluid  size="responsive" bg="var(--mantine-color-blue-1)" className='min-h-screen'>
        <ProfileSections />
      </Container>
    );
}

export default Profile