import React from 'react'
import { Button } from '@mantine/core'

function FriendshipButton({name, friendship, handleRequest}: {name: string, friendship: string, handleRequest: any}) {
    return (
            <Button color='gray' radius='xl' onClick={() => handleRequest(name)}>{friendship}</Button>
    );
}

export default FriendshipButton