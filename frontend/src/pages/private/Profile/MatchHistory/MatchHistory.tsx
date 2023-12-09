import React from 'react';
import { Avatar, Table, Group, Text, Menu, rem, ScrollArea } from '@mantine/core';
import { IconMessages, IconTrash} from '@tabler/icons-react';

// interface FriendInterface {
//   avatar: string;
//   name: string;
//   status: string;
//   email: string;
//   rate: number;
// }

// interface FriendsInterface {
//   Friends: FriendInterface[] | null;
//   // loading: boolean; 
//   // error: string | null;
// }



const data = [
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Robert Wolfkisser',
    status: 'online',
    email: 'rob_wolf@gmail.com',
    rate: 22,
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    name: 'Jill Jailbreaker',
    status: 'ofline',
    email: 'jj@breaker.com',
    rate: 45,
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Henry Silkeater',
    status: 'online',
    email: 'henry@silkeater.io',
    rate: 76,
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Bill Horsefighter',
    status: 'ofline',
    email: 'bhorsefighter@gmail.com',
    rate: 15,
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Jeremy Footviewer',
    status: 'online',
    email: 'jeremy@foot.dev',
    rate: 98,
  },
];

function  MatchHistory() {
  const rows = data.map((item) => (

    <Table key={item.name}>
      <Table.Td>
        <Group gap="sm">
          <Menu
            transitionProps={{ transition: 'pop' }}
            withArrow
            position="bottom-end"
            withinPortal
            >
            <Menu.Target>
             <Avatar size={40} src={item.avatar} radius={40} />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconMessages style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                >
                Send message
              </Menu.Item>
 
              <Menu.Item
                leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                color="red"
                >
                Block friend
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            <Text c="dimmed" fz="xs">
              {item.status}
            </Text>
          </div>
        </Group>
        <Group gap={0}>
        </Group>
      </Table.Td>
    </Table>
  ));

  return (
    <Table>
      <Table.Thead>
        <div className="flex h-16 w-full items-center rounded-md bg-primary p-4">
          <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">Match History</h2>
        </div>
      </Table.Thead>
      {rows != null ?
        (<ScrollArea h={250}>
          <Table.Tbody>
            {rows}
          </Table.Tbody>
        </ScrollArea>) :
        (<p>add freinds to be more frindly and take an sociale achievements </p>)
      }
    </Table>
  );
}

export default MatchHistory