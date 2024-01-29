import React, { useEffect, useState } from "react";
import axios from "axios";
import BlockedUsersInterface from "./BlockedFriendInterface";
import { Group, Table, Avatar, Text, Button } from "@mantine/core";

function BlockedUsers() {
    const [blockedUsersList, setBlockedUsersList] = useState<BlockedUsersInterface[]>([]);

    const getBlockedUsers = async () => {
        await axios.get("user/blocked")
        .then((res) => {
         setBlockedUsersList(res.data);
        }).catch(err => {
            console.error("Error in fetching blocked friend list: ", err);
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
            console.error("error when send post request to In block friend: ", err);
        })
    };

    const blockedUsers = blockedUsersList.map((item) => (
        <Table.Tr key={item.name}>
            <Table.Td>
                <div className="flex justify-between items-center space-x-[90px]">
                    <Group gap="sm">
                        <div className="flex flex-col items-center">
                        <div dir="rtl" className="relative">
                            <button type="button" className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white"> 
                                <Avatar size={40} src={item.avatar} radius={40} />
                            </button>
                        </div>
                            <Text fz="md" fw={800} c='red'>{item.name}</Text>
                        </div>
                    </Group>
                    <Button color="gray" size="xs" radius='xl' onClick={() => handleInBlockUsers(item.name)}>Inblock</Button>
                </div>
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