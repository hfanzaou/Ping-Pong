import React, { useEffect, useState } from "react";
import axios from "axios";
import BlockedUsersInterface from "./BlockedFriendInterface";
import testdata from './BlockedFriendsList.json'
import { Group, Menu, Table, Avatar, Text, rem } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

function BlockedUsers() {
    const [blockedUsersList, setBlockedUsersList] = useState<BlockedUsersInterface[]>([]);

    const getBlockedUsers = async () => {
        await axios.get("user/blocked")
        .then((res) => {
         setBlockedUsersList(res.data);
        }).catch(err => {
        //   setBlockedUsersList(testdata);
            console.error("Error in fetching blocked friend list: ", err);
        })
    };

    useEffect(() => {
        getBlockedUsers();
    }, []);

    const handleInBlockUsers = async (name: string) => {
        console.log("blocked friend name: ", name);
        await axios.post("user/inblock", {name: name})
        .then((res) => {
            if (res.status === 201) {
                getBlockedUsers();
            }
            // res.status === 201 && window.location.reload();
        })
        .catch((err) => {
            console.error("error when send post request to In block friend: ", err);
        })
    };

    const blockedUsers = blockedUsersList.map((item) => (
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
                        <button onClick={() => handleInBlockUsers(item.name)}>
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
        <div>
            {blockedUsers}
        </div>
    );
}

export default BlockedUsers