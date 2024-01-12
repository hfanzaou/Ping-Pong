import React, { useEffect, useState } from 'react';
import { Table, ScrollArea, SegmentedControl} from '@mantine/core';
import FriendInterface from './FriendsInterface';
import BlockedUsers from './BlockedUsers';
import Friends from './Friends';
import FriendRequest from './FriendRequest';
import { Socket } from 'socket.io-client';

function  UsersRelation({socket, setUrlName}: {socket: Socket, setUrlName: Function}) {
  const [value, setValue] = useState<string>('Friends list');

  return (
    <>
        <div className="flex h-2 mt-5 w-full items-center rounded-md bg-gray">
            <SegmentedControl
                fullWidth
                size='md'
                radius='lg'
                value={value}
                onChange={setValue}
                data={[
                    { label: 'Friends list', value: 'Friends list' },
                    // { label: 'Friends list', value: FriendsIcon },  // when make the icone for the blocked users change the value to the icon
                    { label: 'Blocked Users', value: 'Blocked Users'},
                    { label: 'Friends Request', value: "Friends Request"},
                ]}
            />
        </div>
    <ScrollArea h={250}type='never'>
        <Table >
            {value === 'Friends Request' ?
                <Table.Tbody>
                    <FriendRequest/>
                </Table.Tbody> :
            (value === 'Friends list' ?
                (<Table.Tbody>
                    <Friends socket={socket} setUrlName={setUrlName}/>
                </Table.Tbody>) :
                    <Table.Tbody>
                        <BlockedUsers />
                    </Table.Tbody>
            )}
        </Table>
      </ScrollArea>
  </>
  );
}

export default UsersRelation