import React from 'react'
import { SimpleGrid } from '@mantine/core'
import UserCard  from './ProfileInfo/UserCard'
import UsersRelation from './Friends/UsersRelation'
import MatchHistory from './MatchHistory/MatchHistory'
import Achievements from './Achievements/Achievement'
import Header from '../../../Layout/Header/Header'
import Footer from '../../../Layout/Footer/Footer'
import { Socket } from 'socket.io-client'

export function ProfileSections({socket, setUrlName, avatar}: {socket: Socket, setUrlName: Function, avatar: string}) {
    return (
      <div>
        <SimpleGrid
              cols={{ base: 1, xs: 1, md: 2, lg: 2 }}
              spacing={{ base: 10, sm: 'xl', lg: 'xl' }}
              verticalSpacing={{ base: 'xl', sm: 'xl', lg: 'xl' }}
        >
          <UserCard setUrlName={setUrlName} avatar={avatar} />
          <Achievements />
        </SimpleGrid>
        <SimpleGrid
            cols={{ base: 1, xs: 1, md: 2, lg: 2 }}
            spacing={{ base: 10, sm: 'xl', lg: 'xl' }}
            verticalSpacing={{ base: 'xl', sm: 'xl', lg: 'xl'}}
        >
        <MatchHistory />
        <UsersRelation socket={socket} setUrlName={setUrlName}/>
        </SimpleGrid>
      </div>
    );
}

function Profile({socket, setUrlName, avatar}: {socket: Socket, setUrlName: Function, avatar: string}) {
    return (
        // <div  className='h-full ml-8 mr-8 pr-8 pl-8 '>
            <div>
            {/* <Header avatar={avatar}/> */}
             <div className=' ml-4 mr-4 pr-4 pl-4 mb-8 pb-8'> 
                <ProfileSections socket={socket} setUrlName={setUrlName} avatar={avatar}/>
             </div> 
            <Footer/>
        </div>
    );
}

export default Profile