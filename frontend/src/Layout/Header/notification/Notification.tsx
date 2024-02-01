import React, { useEffect, useState } from "react";
import { Avatar, Button, Drawer, Group, ScrollArea, Text } from "@mantine/core";
import NotificationInterface from "./NotificationInterface";
import axios from "axios";
import { useDisclosure } from "@mantine/hooks";
import { Socket } from "socket.io-client";
import { Link } from "react-router-dom";

function Notification({socket, handleRequest}: {socket: Socket, handleRequest: Function}) {
    const [notificationList, setNotificationList] = useState<NotificationInterface[]>([]);
    const [notification, setNotification] = useState<boolean>(false);
    const [opened, { open, close }] = useDisclosure(false);

    const getNotificationTable = async () => {
        await axios.get("user/notification")
        .then((res) => {
            setNotificationList(res.data);
        }).catch(err => {
            console.error("Error in fetching friend requests: ", err);
        })
    };

    useEffect(() => {
        socket?.on("getnotification", (type) => {
            if (type === 'friend request' || type === 'accept friend' || type === 'groupInvite' || type === 'game') {
                setNotification(true);
            } else if (type === 'remove request') {
                setNotification(false);
            }
            getNotificationTable();

            return () => {
                socket.off("getnotification");
            }
        });
    }, [socket]);

    useEffect(() => {
        getNotificationTable();
    }, [socket, setNotification]);

    const handleGroupAccept = () => {
        close();
    };

    const requestRows = notificationList.map((item, index) => (
        (item.type === "friend request" || item.type === "accept friend" || item.type === "groupInvite" || item.type === 'game') &&
        <div key={`${item.username}`+index} className="bg-gray-800 m-1 p-2 rounded-md">
            <div className="flex items-center justify-evenly m-1">
                <Group gap="sm">
                    <Avatar size={40} src={item.avatar} radius={40}/>
                    <Text fz="sm" fw={500} c={''}>
                        {item.username}
                    </Text>
                </Group>
                {item.type === "friend request" && <Text c={'white'}>sent you a friend request </Text>}
                {item.type === "accept friend" && <Text c={'white'}>accepted your friend request</Text>}
  
                {item.type === "groupInvite" &&
                <div>
                    <Text c={'white'} > Invite you to a group</Text>
                    <Button radius='xl' size="xs" color="green" onClick={handleGroupAccept}><Link to={`http://localhost:3000/Chat?name=${item.groupname}`}>check it out</Link></Button>
                </div>}
                {item.type === 'game'&& 
                <div>
                    <Text c={'white'}>sent you a game invite</Text>
                    {/* <Button radius='xl' size="xs" color="green" onClick={() => handleRequest(item.username)}>Accept</Button> */}
                </div>}
            </div>
        </div>
    ));

    return (
        <>
            <Drawer
                onClick={() => setNotification(false)}
                position="right"
                opened={opened}
                onClose={close}
                title="Notification"
                c={'rgb(203 213 225)'}
                scrollAreaComponent={ScrollArea.Autosize}
            >
                {requestRows}
            </Drawer>
            <button onClick={open}>
                <svg className="h-6 w-6" color={notification ? 'red' : "cyan"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
            </button>
        </>
    );
}

export default Notification;