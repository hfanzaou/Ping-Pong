import React, { useEffect, useState } from 'react'
import { Card, Avatar, Text, Group, Button, SimpleGrid, Menu, rem } from '@mantine/core';
import axios from 'axios';
// import sectionimage from '../../../../4304494.jpg'
import sectionimage from './avatar-10.png'
import { Link } from 'react-router-dom';
import { IconUserCircle } from '@tabler/icons-react';


const userInfo = {
    userName: 'rarahhal',
    avatar: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    email: 'rizqyrahhal8@gmail.com',
    level: '1',   // when wine 3 matches move from level to next level
    win: 5,
    losses: 3
}

interface UserCardInterface {
    name: string;
    avatar: string;
    level: number;
    win: number;
    loss: number;
}


function UserCard({setUrlName, avatar} : {setUrlName: Function, avatar: string }) {
    // const [userName, setUserName] = useState<string| undefined>();
    const [data, setData] = useState<UserCardInterface>();
    
    const stats = [
      {value: data?.win, label: 'Wins'},
      {value: data?.win && (data?.win) + (data?.loss), label: 'Played game'},
      {value: data?.loss, label: 'losses'},
    ];

    useEffect(() => {
        const getUserNmae = async () => {
            await axios.get("user/name")
            .then((res) => {
                console.log(res.data.name);
                // setUserName(res.data.name);
                setData(res.data);
            })
            .catch((err) => {
              console.log("Error in geting data in edit profile :", err);
            })
          };
          getUserNmae();
      }, []);

  const items = stats.map((stat) => (
    <div key={stat.label} className={stat.label !== 'Played game' ? "mb-12" : ""}>
      <Text ta="center" fz="lg" fw={500} c={(stat.label === 'Played game'? "dimmed" : stat.label === 'Wins' ? 'green': 'red')}>
        {stat.value}
      </Text>
      <Text ta="center" fz="sm" lh={1} c={(stat.label === 'Played game'? "dimmed" : stat.label === 'Wins' ? 'green': 'red')}>
        {stat.label}
      </Text>
    </div>
  ));

    const  handelShowProfile = () => {
        setUrlName(data?.name);
        // <Link to={'/'+ window.location.pathname.split("/")[1] +'/public/profile'}></Link>
        // window.location.href = '/'+userName+'/public/profile';
    }

  return (
    //  h-[515px]
    // <div className='p-2  w-[250px]  rounded-lg bg-gray-800'>
     <Card p={2} style={{backgroundColor: 'rgb(31 41 55)'}}    radius="lg">
      {/* <Card.Section
        h={250}
        style={{
          backgroundImage: `url(${avatar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
        /> */}
            <div dir="rtl" className="relative">
        {/* <div className="relative flex items-center justify-center"></div> */}
      <Avatar
        src={avatar}
        size={250}
        radius={250}
        m="auto"
        mt={12}
        />
            <Menu position='left-start' offset={2}>
                <Menu.Target >

            <button className="absolute top-1 start-0 m-2">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 512 512">
                <path fill="#74C0FC" d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"/>
            </svg>
            </button>
                </Menu.Target>
                <Menu.Dropdown bg='gray' mt={25}>
                    <Menu.Item
                        onClick={() => handelShowProfile()}
                        leftSection={<IconUserCircle style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    >
                        <Link to={`/UserProfile?name=${data?.name}`}>
                            Show public Profile
                        </Link>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </div>
      <Text  ta="center" fz='xl' fw={800} mt="md" mb='md' c='dimmed'>

        {data?.name}
      </Text>
      <Text ta="center" c="indigo" fz="sm">
      {"level "  + data?.level}
      </Text>
      <Group mt="md" justify="center" gap={30}>
        {items}
      </Group>
      {/* <div className='flex justify-center items-centerw-12 mt-5'>
        <Button radius="md" size="md" color='gray' onClick={handleClick}>
        <Link to={`/UserProfile?name=${userName}`}>
            show your public profile
        </Link>
        </Button>
      </div> */}
    </Card>
    //   </div>
  );
}

export default UserCard;