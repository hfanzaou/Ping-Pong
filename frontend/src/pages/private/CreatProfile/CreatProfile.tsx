import React from 'react';
import { Box, Button, Group } from '@mantine/core';
import ChangeAvatar from './UpdateAvatar';
import ChangeName from './ChangeName';
import EnableTowFactor from './EnableTowFactor';
import { Link } from 'react-router-dom';



function CreatProfile({setAvatar, avatar} : {setAvatar: Function, avatar: string}) {

    return (
        <div className='bg-zinc-500 h-full'>
            <Box maw={340} h={500} m={20} mx="auto">
                <ChangeAvatar settAvatar={setAvatar} avatar={avatar} />
                <ChangeName/>
                <EnableTowFactor/>
                <Link to="/"><Button>Go To Home</Button></Link>
            </Box>
        </div>
  );
}

export default CreatProfile