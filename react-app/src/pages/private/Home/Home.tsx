import React from 'react';
import { Container, Flex } from '@mantine/core';
import Users  from './Users/Users'
import UserCard  from '../Profile/ProfileInfo/UserCard'
import axios from 'axios';
import Login from '../../public/Login/Login';
function Home() {
  let i = 0;
  axios.get("http://localhost:3001/verify", { withCredentials: true })
  .then((res) => {
      console.log(res.status);
  })
  .catch((err) => {
    //console.log('here')
   i = 1;
  })
  if (i === 1) {
    return (
      <Login />
    );
  }
  return (
    <Container fluid  size="responsive" bg="var(--mantine-color-blue-1)" className='min-h-screen'>
      <UserCard />
      <Users />
    </Container>
  );
}

export default Home