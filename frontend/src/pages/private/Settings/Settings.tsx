import React from 'react';
import { Card, SimpleGrid } from '@mantine/core';
import ChangeAvatar from './UpdateAvatar';
import ChangeName from './ChangeName';
import EnableTowFactor from './EnableTowFactor';

function EditeProfile({setAvatar, avatar} : {setAvatar: Function, avatar: string}) {
    return (
        <div className='flex justify-center mx-[50px] mt-5 p-5 rounded-xl bg-slate-900 shadow-5 h-[75vh]'>
            <div className='grid place-items-center'>
                <Card radius="lg"
                    className='grid place-items-center space-y-5' 
                    style={{backgroundColor: 'rgb(31 41 55)'}} 
                >
                        <ChangeAvatar settAvatar={setAvatar} avatar={avatar} />
                        <ChangeName/>
                        <EnableTowFactor/>
                </Card>
            </div>
        </div>
    );
}

export default EditeProfile