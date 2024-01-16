import React, { useEffect, useState } from 'react';
import { Table, ScrollArea, SegmentedControl} from '@mantine/core';
import FriendInterface from './FriendsInterface';
import BlockedUsers from './BlockedUsers';
import Friends from './Friends';
import FriendRequest from './FriendRequest';
import { Socket } from 'socket.io-client';

function  UsersRelation({socket, setUrlName}: {socket: Socket, setUrlName: Function}) {
  const [value, setValue] = useState<string>('Friends');

  return (
    <div>
        <div className="flex h-2 mt-5 mb-5 w-full items-center rounded-md bg-gray">
            <SegmentedControl
                fullWidth
                size='md'
                radius='lg'
                value={value}
                onChange={setValue}
                data={[
                    { label: 'Friends', value: 'Friends' },
                    // { label: 'Friends list', value: FriendsIcon },  // when make the icone for the blocked users change the value to the icon
                    { label: 'Blocked', value: 'Blocked'},
                    { label: 'Requests', value: "Requests"},
                ]}
            />
        </div>
    <ScrollArea h={250}type='never'>
        <Table >
            {value === 'Requests' ?
                <Table.Tbody>
                    <FriendRequest/>
                </Table.Tbody> :
            (value === 'Friends' ?
                (<Table.Tbody>
                    <Friends socket={socket} setUrlName={setUrlName}/>
                </Table.Tbody>) :
                    <Table.Tbody>
                        <BlockedUsers />
                    </Table.Tbody>
            )}
        </Table>
      </ScrollArea>
  </div>
  );
}

export default UsersRelation