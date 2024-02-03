import React, { useEffect, useState } from "react";
import axios from "axios";
import BlockedUsersInterface from "./BlockedFriendInterface";
import { Group, Table, Avatar, Text, Button, Blockquote } from "@mantine/core";

function BlockedUsers() {
    const [blockedUsersList, setBlockedUsersList] = useState<BlockedUsersInterface[]>([]);

    const getBlockedUsers = async () => {
        await axios.get("user/blocked")
        .then((res) => {
         setBlockedUsersList(res.data);
        }).catch(err => {
            // console.error("Error in fetching blocked friend list: ", err);
        })
    };

    useEffect(() => {
        getBlockedUsers();
    }, []);

    const handleInBlockUsers = async (name: string) => {
        await axios.post("user/inblock", {name: name})
        .then((res) => {
            if (res.status === 201) {
                getBlockedUsers();
            }
        })
        .catch((err) => {
            // console.error("error when send post request to In block friend: ", err);
        })
    };

    const blockedUsers = blockedUsersList.map((item) => (
        <Table key={item.name}>
            <Table.Tbody>
                <Table.Tr >
                    <Table.Td>
                        <div className="flex justify-between items-center space-x-[90px]">
                            <Group gap="sm">
                                <div className="flex flex-col items-center">
                                    <Avatar size={40} src={item.avatar} radius={40} />
                                </div>
                                <Text fz="md" fw={800} c='red'>{item.name}</Text>
                            </Group>
                            <Button color='indigo' size="xs" radius='xl' onClick={() => handleInBlockUsers(item.name)}>
                                <div className='text-lg'>
                                    Unblock
                                </div>
                            </Button>
                        </div>
                    </Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    ));

    return (
        <div>
            {Object.keys(blockedUsers).length ?
                blockedUsers :
                <Blockquote className="text-xl" ta='center' color="white" c='cyan' radius="lg" mt="xl">
                    No Blocked User
                </Blockquote>
            }
        </div>
    );
}

export default BlockedUsers