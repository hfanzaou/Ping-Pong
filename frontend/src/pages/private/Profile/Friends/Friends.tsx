import React, { useEffect, useState } from 'react';
import { Avatar, Table, Group, Text, Menu, rem, ScrollArea, Blockquote } from '@mantine/core';
import { IconMessages, IconTrash, IconInfoCircle} from '@tabler/icons-react';

import FriendInterface from './FriendsInterface';

import testdata from './test.json';
import axios from 'axios';

function  Frindes() {
  const [friendList, setFriendList] = useState<FriendInterface[]>([]);

  useEffect(() => {
    const getFriends = async () => {
      await axios.get("http://localhost:3001/friend/list")
      .then((res) => {
       setFriendList(res.data);
      }).catch(err => {
        console.error("Error in fetching friend list: ", err);
      })
    };
    getFriends();
  }, []);

  const rows = friendList.map((item) => (  
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

  const icon = <IconInfoCircle/>

  return (
    <Table>
      <Table.Thead>
        <div className="flex h-16 w-full items-center rounded-md bg-primary p-4">
          <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">Friend's</h2>
        </div>
      </Table.Thead>
      {Object.keys(rows).length ?
        (<ScrollArea h={250}>
          <Table.Tbody>
            {rows}
          </Table.Tbody>
        </ScrollArea>) :
        (<Blockquote color="gray" radius="xl" iconSize={33} cite="transcendence tame" icon={icon} mt="xl">
          Add Freinds to be more frindly and take an sociale achievements
        </Blockquote>)
        // Life is like an npm install – you never know what you are going to get.
      }
      <Table.Thead>
        <div className="flex h-16 w-full items-center rounded-md bg-primary p-4">
          <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">Blocked</h2>
        </div>
      </Table.Thead>
      {/* {Object.keys(rows).length ?
        (<ScrollArea h={250}>
          <Table.Tbody>
            {rows}
          </Table.Tbody>
        </ScrollArea>) : */}
        <Blockquote color="gray" radius="xl" iconSize={33} cite="transcendence tame" icon={icon} mt="xl">
          No one blocked for instance
        </Blockquote>
        {/* } */}
    </Table>
  );
}

export default Frindes