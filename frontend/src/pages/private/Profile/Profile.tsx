import React from 'react'
import { Socket } from 'socket.io-client'
import { Card, SimpleGrid } from '@mantine/core'
import UserCard  from './ProfileInfo/UserCard'
import UsersRelation from './UsersRelation/UsersRelation'
import MatchHistory from './MatchHistory/MatchHistory'
import Achievements from './Achievements/Achievement'

export function ProfileSections({socket, setUrlName, avatar}: {socket: Socket, setUrlName: Function, avatar: string}) {
    return (
        <SimpleGrid
              cols={{ base: 1, xs: 1, md: 1, lg: 2, xl: 2}}
              spacing={'md'}
        >
            <SimpleGrid
                cols={{ base: 1, xs: 1, md: 1, lg: 2, xl: 2}}
                spacing={'md'}
            >
                <UserCard setUrlName={setUrlName} avatar={avatar} />
                <Card p={0} className='h-full w-full' style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg">
                    <UsersRelation socket={socket} setUrlName={setUrlName}/>
                </Card>
            </SimpleGrid>
            <div>
                <Achievements />
                <MatchHistory />
            </div>
        </SimpleGrid>
    );
}

function Profile({socket, setUrlName, avatar}: {socket: Socket, setUrlName: Function, avatar: string}) {
    return (
        <div className='mx-[50px] mt-[20px] p-8 rounded-xl bg-slate-900 shadow-5 xl:h-[75vh]'>
            <ProfileSections socket={socket} setUrlName={setUrlName} avatar={avatar}/>
        </div>
    );
}

export default Profile