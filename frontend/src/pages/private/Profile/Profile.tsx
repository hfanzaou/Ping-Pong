import React from 'react'
import { Card, SimpleGrid } from '@mantine/core'
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
              spacing={'md'}
            //   verticalSpacing={{ base: 'xl', sm: 'xl', lg: 'xl' }}
        >
        <SimpleGrid
            cols={{ base: 1, xs: 1, md: 2, lg: 2 }}
            spacing={'md'}
            // spacing={{ base: 10, sm: 'sm', lg: 'xs', xl: 'xm' }}
            // verticalSpacing={{ base: 'xl', sm: 'xl', lg: 'xl'}}
        >

        
        {/* <div> */}

          <UserCard setUrlName={setUrlName} avatar={avatar} />
        {/* </div> */}
        {/* <div> */}
          <Card  style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg">

          <UsersRelation socket={socket} setUrlName={setUrlName}/>
            </Card>
        {/* </div> */}
        </SimpleGrid>
        <div>
            {/* <div className=''> */}

          {/* <Card  style={{backgroundColor: 'rgb(31 41 55)'}} radius="md"> */}
          {/* </Card> */}
            {/* </div> */}
          <Achievements />
            <MatchHistory />
        </div>
        </SimpleGrid>
      </div>
    );
}

function Profile({socket, setUrlName, avatar}: {socket: Socket, setUrlName: Function, avatar: string}) {
    return (
        <div className='mx-[50px] mt-[20px] p-5 rounded-xl bg-slate-900 shadow-5'>
            <ProfileSections socket={socket} setUrlName={setUrlName} avatar={avatar}/>
        </div>
    );
}

export default Profile



    // //  h-[515px]
    // <div className='m-2 w-[300px] p-2 rounded-lg bg-gray-800'>
    // <Card w={300} style={{backgroundColor: 'transparent'}}    radius="md">
    //   {/* <Card.Section
    //     h={60}
    //     >
    //     </Card.Section> */}
    //   <Avatar
    //     src={avatar}
    //     size={200}
    //     radius={200}
    //     mx="auto"
    //     // mt={-30}
    //     />