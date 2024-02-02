import React, { memo } from 'react';
import { Card, SimpleGrid } from '@mantine/core';
import Users  from './Users/Users'
import image from "./assite/bg.gif"
import UsersInterface from './Users/UsersInterface';
import { Socket } from 'socket.io-client';

function Home({socket, setUrlName, userList, setUsersList, searchList, setSearchList, handleRequest, avatar}: {socket: Socket, setUrlName: Function, userList: UsersInterface[], setUsersList: Function, searchList: UsersInterface[], setSearchList: Function, handleRequest: any, avatar: string}) {

    return (
        <div className='mx-[50px] mt-[20px] p-5 rounded-xl bg-slate-900 shadow-5 xl:h-[75vh]'>
            <Card p={0} style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg" className='h-full'>
                <SimpleGrid
                    cols={{ base: 1, sm: 1, lg: 2, xl: 2 }}
                >
                    <Users socket={socket} setUrlName={setUrlName} userList={userList} searchList={searchList} setUsersList={setUsersList} setSearchList={setSearchList} handleRequest={handleRequest}/>
                    {/* <img className='rounded-md w-full h-full' src={image} /> */}
                    <img className='object-fill rounded-md w-full h-full' src={image} />

                </SimpleGrid>
            </Card>
        </div>
    );
}

export default memo(Home)

