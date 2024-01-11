import React from 'react';
import { Box } from '@mantine/core';
import ChangeAvatar from './UpdateAvatar';
import ChangeName from './ChangeName';
import EnableTowFactor from '../EnableTowFactor';
import Header from '../../../../Layout/Header/Header';
import Footer from '../../../../Layout/Footer/Footer';

function EditeProfile({setAvatar, avatar} : {setAvatar: Function, avatar: string}) {

    return (
        <div className='grid place-items-center h-full'>
            {/* <Header avatar={avatar}/> */}
            {/* <Box maw={340} mx="auto" className='h-full'> */}
                {/* <div className=''> */}
                    <ChangeAvatar settAvatar={setAvatar} avatar={avatar} />
                {/* </div> */}
                <ChangeName/>
                <EnableTowFactor/>
                {/* <div className='flex space-x-6'> */}
                {/* </div> */}
                {/* <Group justify="flex-end" mt="md">
                <Button type="button" onClick={handleClick}>Save Changs</Button>
            </Group> */}
            {/* </Box> */}
            {/* <Footer/> */}
        </div>
  );
}

export default EditeProfile