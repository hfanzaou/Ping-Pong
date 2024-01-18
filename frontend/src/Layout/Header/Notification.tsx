import axios from "axios";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Group, Menu, Modal, ScrollArea, Table, Text } from "@mantine/core";
import FriendInterface from "../../pages/private/Profile/UsersRelation/FriendsInterface";
import NotificationInterface from "./NotificationInterface";
import { useDisclosure } from "@mantine/hooks";
import { Socket } from "socket.io-client";



function Notification({socket}: {socket: Socket}) {
    const [notificationList, setNotificationList] = useState<NotificationInterface[]>([]);
    const [notification, setNotification] = useState<boolean>(false);
    const [opened, { open, close }] = useDisclosure(false);

    const getRequests = async () => {
        await axios.get("user/notification")
        .then((res) => {
            setNotificationList(res.data);
        }).catch(err => {
            // setRequestFriendList(testdata);
            console.error("Error in fetching friend requests: ", err);
        })
    };

    // useEffect(() => {
    //     const handleNotification = () => {
    //         setNotification(true);
    //     };
    
    //     socket?.on("getnotification", handleNotification);
        
    //     // Clean up the effect
    //     return () => {
    //         socket?.off("getnotification", handleNotification);
    //     };
    // }, [socket]);
    useEffect(() => {
    socket?.on("getnotification", () => {
        setNotification(true);
        getRequests();
        console.log("get notification");
        return () => {
            socket.off("getnotification");
        }
    });
    }, [socket]);

    useEffect(() => {
        getRequests();
    }, [socket, setNotification]);

    const requestRows = notificationList.map((item) => (
        // <div className=" h-[700px] bg-gray-500">
          <div className="flex items-center justify-evenly">
          <Group gap="sm">
                <Avatar size={40} src={item.avatar} radius={40}/>
              <Text fz="sm" fw={500} c='indigo'>
                {item.username}
              </Text>
          </Group>
            <Text >Sent you a friend request</Text>
            </div>
        //   {/* <Button radius='xl' color='gray' onClick={() => handleAccepteFriend(item.name)}>
        //     Accept friend
        //   </Button> */}
        // </div>


      ));
    

    return (

        <>
            {/* <Modal radius='md' opened={opened} onClose={close} title="Notification" centered>
                {requestRows}
            </Modal> */}



            <Drawer 
                // offset={20}
                onClick={() => setNotification(false)}
                position="right"
                opened={opened}
                onClose={close}
                title="Notification"
                scrollAreaComponent={ScrollArea.Autosize}
                c={'blue'}
            >

                {requestRows}
            </Drawer>

            <button onClick={open} type="button" className={notification ? "relative rounded-full bg-gray-800 text-blue-500 hover:text-white": "relative rounded-full bg-gray-800 text-gray-400 hover:text-white"}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
            </button>

        </>



    //     <Menu  position="bottom-end" offset={20}>
    //     <Menu.Target>
    //     <button type="button" className={notification ? "relative rounded-full bg-gray-800 text-blue-500 hover:text-white": "relative rounded-full bg-gray-800 text-gray-400 hover:text-white"}>
    //       <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
    //           <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    //       </svg>
    //     </button>
    //     </Menu.Target>
    //     <Menu.Dropdown bg='gray'>
    //         <Table>
    //             <Table.Thead>
    //                 <Table.Tr>
    //                     friend request
    //                 </Table.Tr>
    //             </Table.Thead>
    //             <Table.Tbody>
    //                 {requestRows}
    //             </Table.Tbody>
    //         </Table>
    //     </Menu.Dropdown>
    // </Menu>
    );
}

export default Notification;