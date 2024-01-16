import React from 'react';
import { Card, SimpleGrid } from '@mantine/core';
import ChangeAvatar from './UpdateAvatar';
import ChangeName from './ChangeName';
import EnableTowFactor from './EnableTowFactor';

function EditeProfile({setAvatar, avatar} : {setAvatar: Function, avatar: string}) {

    return (
        <div className='flex justify-center mx-[50px] h-[497px] mt-5 p-5 rounded-xl bg-slate-900 shadow-5'>
            <SimpleGrid className='w-1/2 grid place-items-center'>
                <Card style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg">
                <SimpleGrid 
                    spacing='lg'
                    className='grid place-items-center'
                >
                    <ChangeAvatar settAvatar={setAvatar} avatar={avatar} />
                    <ChangeName/>
                    <EnableTowFactor/>
                </SimpleGrid>
                </Card>
            </SimpleGrid>
        </div>
  );
}

export default EditeProfile