import React, { useEffect, useState } from 'react';
import { Avatar, Table, Group, Text, Menu, rem, Blockquote} from '@mantine/core';
import { IconMessages, IconTrash, IconUserCircle} from '@tabler/icons-react';
import FriendInterface from './FriendsInterface';

import axios from 'axios';
import { Link } from 'react-router-dom';


function  Frindes({setUrlName}: {setUrlName: Function}) {
  const [friendList, setFriendList] = useState<FriendInterface[]>([]);
//   const [searchFriendList, setSearchFriendList] = useState<FriendInterface[]>([]);
  const [value, setValue] = useState<string>('Friends list');

  const handelShowProfile = (name: string) => {
        setUrlName(name);
  };
  
    const getFriends = async () => {
      await axios.get("user/friend/list")
      .then((res) => {
       setFriendList(res.data);
      }).catch(err => {
        // setFriendList(testdata);
        console.error("Error in fetching friend list: ", err);
      })
    };
    
    useEffect(() => {
        getFriends();
    }, []);

  const handleBlockUser = async (name: string) => {

    console.log("blocked friend name: ", name);
    await axios.post("user/block", {name: name})
    .then((res) => {
        if (res.status === 201) {
            getFriends();
        }
        // res.status === 201 && window.location.reload();
    })
    .catch((err) => {
        console.error("error when send post request to block friend: ", err);

    })
  };

  const rows = friendList.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap="sm">
          <Menu
            position="bottom-start"
            >
            <Menu.Target>
             <Avatar size={40} src={item.avatar} radius={40} />
            </Menu.Target>
            <Menu.Dropdown>
            <Menu.Item
              onClick={() => handelShowProfile(item.name)}
                leftSection={
                  <IconUserCircle style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                >
                    <Link to={`/UserProfile?name=${item.name}`}>
                        Show Profile
                    </Link>
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconMessages style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                >
                <Link to={'/Chat'}>Send message</Link>
              </Menu.Item>
              <Menu.Item
                onClick={() => handleBlockUser(item.name)}
                leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                >
                      Block user
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
      </Table.Td>
    </Table.Tr>
  ));


  return (
    <div>
        {Object.keys(rows).length ?
            rows :
            <Table.Tr>
                <Table.Td>
                    <Blockquote color="gray" radius="xl" iconSize={33} mt="xl">
                        Add Freinds to shows them here
                    </Blockquote>
                </Table.Td>
            </Table.Tr>
        }    
    </div>);
}

export default Frindes