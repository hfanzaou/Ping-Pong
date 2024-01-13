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
        <SimpleGrid
            cols={{ base: 1, xs: 1, md: 1, lg: 1 }}
            spacing={{ base: 10, sm: 'xl', lg: 'xl' }}
            verticalSpacing={{ base: 'xl', sm: 'xl', lg: 'xl'}}
        >
          <Achievements />
        {/* <MatchHistory /> */}
        <UsersRelation socket={socket} setUrlName={setUrlName}/>
        </SimpleGrid>
        </SimpleGrid>
      </div>
    );
}

function Profile({socket, setUrlName, avatar}: {socket: Socket, setUrlName: Function, avatar: string}) {
    return (
        // <div  className='h-full ml-8 mr-8 pr-8 pl-8 '>
        // h-[530px]
            <div className='ml-[70px] mr-[70px] pl-5 pr-5 rounded-lg bg-slate-900 shadow-5'>
            {/* <Header avatar={avatar}/> */}
             {/* <div className=' '>  */}
                <ProfileSections socket={socket} setUrlName={setUrlName} avatar={avatar}/>
             {/* </div>  */}
            {/* <Footer/> */}
        </div>
    );
}

export default Profile