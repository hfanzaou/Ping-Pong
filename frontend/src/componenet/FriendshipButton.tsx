import React from 'react'
import { Button } from '@mantine/core'

function FriendshipButton({name, friendship, handleRequest}: {name: string, friendship: string, handleRequest: any}) {
    let color: string = 'gray';
    
    if (friendship === 'add friend') {
        color = 'blue';
    } else if (friendship === 'remove request' || friendship === 'remove friend') {
        color = 'red';
    } else if (friendship === 'accept friend') {
        color = 'green';
    }

    return (
            <Button w={200} color={color} size='xs' radius='xl' onClick={() => handleRequest(name)}>
                <div className='text-lg'>
                    {friendship}
                </div>
            </Button>
    );
}

export default FriendshipButton