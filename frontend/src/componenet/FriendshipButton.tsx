import React from 'react'
import { Button } from '@mantine/core'

function FriendshipButton({name, friendship, handleRequest}: {name: string, friendship: string, handleRequest: any}) {
    let color: string = 'gray';
    
    if (friendship === 'add friend') {
        color = '#2D4B81';
    } else if (friendship === 'remove request') {
        color = '#C91A52';
    }else if (friendship === 'remove friend') {
        color = '#C91A25';
    } else if (friendship === 'accept friend') {
        color = '#2BDD66';
    }

    return (
            <Button w={160} color={color} size='xs' radius='xl' onClick={() => handleRequest(name)}>
                <div className='text-lg'>
                    {friendship}
                </div>
            </Button>
    );
}

export default FriendshipButton