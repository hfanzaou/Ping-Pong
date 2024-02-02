import React from 'react'
import { Button } from '@mantine/core'

function FriendshipButton({name, friendship, handleRequest}: {name: string, friendship: string, handleRequest: any}) {
    return (
            <Button w={200} size='xs' color='gray' radius='xl' onClick={() => handleRequest(name)}>
                <div className='text-lg'>
                    {friendship}
                </div>
            </Button>
    );
}

export default FriendshipButton