import axios from "axios";
import React, { useEffect, useState } from "react";
import BlockedFriendInterface from "./BlockedFriendInterface";
import testdata from './BlockedFriendsList.json'
import { Group, Menu, Table, Avatar, Text, rem } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

function BlockedFriends() {
    const [blockedFriendList, setBlockedFriendList] = useState<BlockedFriendInterface[]>([]);

    useEffect(() => {
        const getBlockedFriends = async () => {
            await axios.get("http://localhost:3001/friend/blocked")
            .then((res) => {
             setBlockedFriendList(res.data);
            }).catch(err => {
              setBlockedFriendList(testdata);
                console.error("Error in fetching blocked friend list: ", err);
            })
        };
        getBlockedFriends();
    }, []);

    const handleInBlockFriend = async (name: string) => {
        console.log("blocked friend name: ", name);
        await axios.post("http://localhost:3001/inblock/friend", {name: name})
        .then((res) => {
            res.status === 201 && window.location.reload();
        })
        .catch((err) => {
            console.error("error when send post request to In block friend: ", err);
        })
    };

    const blockedRows = blockedFriendList.map((item) => (  
        <Table.Tr key={item.name}>
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
                      leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                      color="red"
                      >
                        <button onClick={() => handleInBlockFriend(item.name)}>
                          InBlock friend
                        </button>
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                  <Text fz="sm" fw={500}>
                    {item.name}
                  </Text>
              </Group>
            </Table.Td>
          </Table.Tr>
        ));
    return (
        blockedRows
    );
}

export default BlockedFriends 