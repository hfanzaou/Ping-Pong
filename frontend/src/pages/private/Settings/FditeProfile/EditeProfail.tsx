import React from 'react';
import { Box } from '@mantine/core';
import ChangeAvatar from './UpdateAvatar';
import ChangeName from './ChangeName';
import EnableTowFactor from '../EnableTowFactor';
import Header from '../../../../Layout/Header/Header';
import Footer from '../../../../Layout/Footer/Footer';

function EditeProfile({setAvatar, avatar} : {setAvatar: Function, avatar: string}) {

    return (
        <div className=''>
            <Header avatar={avatar}/>
            <Box maw={340} mx="auto" className='h-[800px]'>
                <div className=''>
                    <ChangeAvatar settAvatar={setAvatar} avatar={avatar} />
                </div>
                <div className=''>

                <ChangeName/>
                </div>
                <div className=''>

                <EnableTowFactor/>
                </div>
                {/* <Group justify="flex-end" mt="md">
                <Button type="button" onClick={handleClick}>Save Changs</Button>
            </Group> */}
            </Box>
            <Footer/>
        </div>
  );
}

export default EditeProfile