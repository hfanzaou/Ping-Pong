import React, { memo, useEffect } from 'react';
import { BackgroundImage, Card, Container, Flex, SimpleGrid } from '@mantine/core';
import Users  from './Users/Users'
import UserCard  from '../Profile/ProfileInfo/UserCard'
import image from "./assite/bg.gif"
import Header from '../../../Layout/Header/Header';
import Footer from '../../../Layout/Footer/Footer';
import UsersInterface from './Users/UsersInterface';
import axios from 'axios';
import { Socket } from 'socket.io-client';

function Home({socket, setUrlName, userList, setUsersList, searchList, setSearchList, handleRequest, avatar}: {socket: Socket, setUrlName: Function, userList: UsersInterface[], setUsersList: Function, searchList: UsersInterface[], setSearchList: Function, handleRequest: any, avatar: string}) {
  
    return (
        <div className='mx-[50px] mt-[20px] p-5 rounded-xl bg-slate-900 shadow-5'>
          <SimpleGrid
          cols={{ base: 1, sm: 1, lg: 2 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'lg' }}
          >
            <Card  style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg">
                <Users socket={socket} setUrlName={setUrlName} userList={userList} searchList={searchList} setUsersList={setUsersList} setSearchList={setSearchList} handleRequest={handleRequest}/>
            </Card>
            <img className='rounded-xl' src={image} />
          </SimpleGrid>
        </div>
  );
}

export default memo(Home)

