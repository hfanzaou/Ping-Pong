import React from 'react';
import { Box } from '@mantine/core';
import ChangeAvatar from './UpdateAvatar';
import ChangeName from './ChangeName';
import EnableTowFactor from '../EnableTowFactor';

function EditeProfile() {
    
    const handleClick= () => {
        window.location.href = "http://localhost:3001/Profile";
    };

    return (
        <Box maw={340} mx="auto">
            <ChangeAvatar/>
            <ChangeName/>
            <EnableTowFactor/>
            {/* <Group justify="flex-end" mt="md">
            <Button type="button" onClick={handleClick}>Go to my Profile</Button>
            </Group> */}
        </Box>
  );
}

export default EditeProfile