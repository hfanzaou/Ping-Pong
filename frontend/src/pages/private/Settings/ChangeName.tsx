import React, { useEffect, useState } from 'react';
import { TextInput, Button, Modal } from '@mantine/core';
import axios from 'axios';
import { IconEdit } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

function ChangeName() {
    const [username, setUserName] = useState<string>();
    const [uniqueName, setUniqueNmae] = useState<string>('');
    const [invalidName, setInvalidName] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(true);

    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => { // make this in a context-provider from App.tsx
        const getUserInfo = async () => {
            await axios.get("user/name")
            .then((res) => {
                console.log(res.data.name);
                setUserName(res.data.name);
            })
            .catch((err) => {
                console.log("Error in geting data in edit profile :", err);
            })
        };
        getUserInfo();
    }, []);

    const handleSaveName = async () => {
        await axios.post('settings/name', {uniqueName: uniqueName})
        .then(res => {
            console.log(res.data);
            {res.status != 201 ? (setInvalidName(true)) : (setInvalidName(false),
                //  setOpenChangeName(!openChangeName),
                  setUserName(uniqueName))}
                  close();
        })
        .catch(err => {
            setInvalidName(true);
            setDisabled(true);
            console.error("Error in send profile info: ", err);
        })
    };

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUniqueNmae(e.target.value);
        setInvalidName(false);
        e.target.value.length > 4 ? setDisabled(false) : setDisabled(true);
    };
    
    const handleOpenChangeName = () => {
        setDisabled(true);
        setInvalidName(false);
        open();
    };

    const handleCloseChangeName = () => {
        setDisabled(true);
        close();
    };

    return (
        <div className=''>
            <div className='grid'>
                <div dir="rtl" className="relative" >
                    <Button
                        size='sm'
                        radius={'xl'}
                        color='blue'
                        onClick={handleOpenChangeName}
                    >
                        <div className='m-3'></div>
                        {username}
                        <div className="absolute top-0 right-0">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="30" viewBox="0 0 640 512">
                                <path fill="#3e35bb" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H322.8c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7l40.3-40.3c-32.1-31-75.7-50.1-123.9-50.1H178.3zm435.5-68.3c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM375.9 417c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L576.1 358.7l-71-71L375.9 417z"/>
                            </svg>
                        </div>
                    </Button>
                </div>
            </div>
            <Modal
                opened={opened}
                onClose={handleCloseChangeName}
                withCloseButton={false}
                radius='lg' 
                c={'blue'}
                centered={true}
            >
                <div className='flex flex-col justify-center'>
                    <TextInput
                        label={username}
                        placeholder="Unique Name"
                        description="change your name by set a uniuqe name hase more then 4 charachter"
                        onChange={handleChangeName}
                        error={invalidName ? "alredy used": false}
                    />
                    <div className='mt-5'>
                        <Button
                            mr='sm'
                            radius={'xl'}
                            color='green'
                            size='xs'
                            onClick={handleSaveName} 
                            disabled={disabled}
                        >
                            Save Name
                        </Button>

                        <Button
                            radius={'xl'}
                            size='xs'
                            color='yellow'
                            onClick={handleCloseChangeName}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ChangeName