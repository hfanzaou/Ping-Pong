import React, { useState } from 'react';
import { Table, ScrollArea, SegmentedControl, SimpleGrid} from '@mantine/core';
import BlockedUsers from './blockedUsers/BlockedUsers';
import Friends from './friends/Friends';
import FriendRequest from './friendRequest/FriendRequest';
import { Socket } from 'socket.io-client';

function  UsersRelation({socket, setUrlName}: {socket: Socket, setUrlName: Function}) {
    const [value, setValue] = useState<string>('Friends');

    return (
        <div className='flex flex-col items-center space-y-2 h-full w-full'>
            <SegmentedControl
                m='md'
                size='md'
                w='90%'
                radius='lg'
                value={value}
                color='blue'
                bg={'rgb(39 39 42)'}
                onChange={setValue}
                data={[
                    {label: 'Friends', value: 'Friends'},
                    {label: 'Blocked', value: 'Blocked'},
                    {label: 'Requests', value: "Requests"},
                ]}
            />
            <ScrollArea h='55vh' type='never'>
                <Table>
                    <Table.Tbody>
                        {value === 'Requests' ?
                            <FriendRequest socket={socket} setUrlName={setUrlName}/> :
                        (value === 'Friends' ?
                            <Friends socket={socket} setUrlName={setUrlName}/> :
                            <BlockedUsers/>
                        )}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </div>
    );
}

export default UsersRelation