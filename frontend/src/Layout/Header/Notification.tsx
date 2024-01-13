import axios from "axios";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Group, Menu, Table, Text } from "@mantine/core";
import FriendInterface from "../../pages/private/Profile/Friends/FriendsInterface";
import NotificationInterface from "./NotificationInterface";

function Notification() {
    const [notificationList, setNotificationList] = useState<NotificationInterface[]>([]);
    const [notification, setNotification] = useState<boolean>(false);

    const getRequests = async () => {
        await axios.get("user/notification")
        .then((res) => {
            setNotificationList(res.data);
        }).catch(err => {
            // setRequestFriendList(testdata);
            console.error("Error in fetching friend requests: ", err);
        })
    };

    useEffect(() => {
        getRequests();
    }, []);

    const requestRows = notificationList.map((item) => (
        <Table.Tr key={item.username}>
        <Table.Td>
          <Group gap="sm">
                <Avatar size={40} src={item.avatar} radius={40}/>
            <div>
              <Text fz="sm" fw={500}>
                {item.username}
              </Text>
              {/* <Text fz="xs" c="dimmed">
                {item.state}
              </Text> */}
            </div>
          </Group>
        </Table.Td>
         <Table.Td>
            <Text >Sent you a friend request</Text>
          {/* <Button radius='xl' color='gray' onClick={() => handleAccepteFriend(item.name)}>
            Accept friend
          </Button> */}
        </Table.Td>
      </Table.Tr>
      ));
    

    return (
        <Menu  position="bottom-end" offset={20}>
        <Menu.Target>
        <button type="button" className={notification ? "relative rounded-full bg-gray-800 text-blue-500 hover:text-white": "relative rounded-full bg-gray-800 text-gray-400 hover:text-white"}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>
        </Menu.Target>
        <Menu.Dropdown bg='gray'>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        friend request
                        {/* {requestRows} */}
                        {/* <Table.Th>User Name</Table.Th>
                        <Table.Th>Accepte friend</Table.Th> */}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {requestRows}
                </Table.Tbody>
            </Table>
            {/* <div className="h-full w-[300px]">
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <p className="place-self-start ">User Name</p>
                        <p className="place-item-end">accepte friend</p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <p className="place-self-start text-white text-md font-bold">User Name</p>
                        <p className="place-self-end text-gray-400 text-xs">accepte friend</p>
                    </div>
                </div>
            </div> */}
        </Menu.Dropdown>
    </Menu>
    );
}

export default Notification;