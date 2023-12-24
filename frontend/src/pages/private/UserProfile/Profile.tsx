import React, { useState } from 'react'
import {Container, ScrollArea, SimpleGrid} from '@mantine/core'
import UserCard  from './ProfileInfo/UserCard'
import MatchHistory from './MatchHistory/MatchHistory'
import Achievements from './Achievements/Achievement'
import Header from '../../../Layout/Header/Header'
import Footer from '../../../Layout/Footer/Footer'

export function ProfileSections() {
    return (
      <div>
        <SimpleGrid
              cols={{ base: 1, sm: 1, lg: 2 }}
              spacing={{ base: 10, sm: 'xl', lg: 'xl' }}
              verticalSpacing={{ base: 'xl', sm: 'xl', lg: 'xl' }}
        >
          <UserCard />
          <Achievements />
          <MatchHistory />
        </SimpleGrid>
      </div>
    );
}

function Profile() {
    return (
        // <div  className='h-full ml-8 mr-8 pr-8 pl-8 '>
            <div>
            {/* <Header avatar={avatar}/> */}
             <div className=' ml-4 mr-4 pr-4 pl-4 mb-8 pb-8'> 
                <ProfileSections/>
             </div> 
            <Footer/>
        </div>
    );
}

export default Profile