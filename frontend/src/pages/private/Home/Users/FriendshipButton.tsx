import React from 'react'
import { Button } from '@mantine/core'

function FriendshipButton({name, friendship, handleRequest}: {name: string, friendship: string, handleRequest: any}) {
    return (
        <div>
            <Button color='gray' radius='xl' onClick={() => handleRequest(name, friendship)}>{friendship}</Button>
        </div>
    )
}

export default FriendshipButton