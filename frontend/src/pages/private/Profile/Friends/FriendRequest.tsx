import React, { useEffect, useState } from 'react';
import { Avatar, Table, Group, Text, Blockquote, Button } from '@mantine/core';
import FriendInterface from './FriendsInterface';

import axios from 'axios';

function  FrindeRequest() {
  const [requestFriendList, setRequestFriendList] = useState<FriendInterface[]>([]);

    const getRequests = async () => {
        await axios.get("user/friend/requests")
        .then((res) => {
            setRequestFriendList(res.data);
        }).catch(err => {
            // setRequestFriendList(testdata);
            console.error("Error in fetching friend requests: ", err);
        })
    };

    useEffect(() => {
        getRequests();
    }, []);

  const handleAccepteFriend = async (name: string) => {
    console.log("accepted friend name: ", name);
    await axios.post("user/accept/friend", {name: name})
    .then((res) => {
        if (res.status === 201) {
            getRequests();
        }
    })
    .catch((err) => {
        console.error("error when send post request to accepte friend: ", err);
    })
  }

  const requestRows = requestFriendList.map((item) => (
    <Table.Tr key={item.name}>
    <Table.Td>
      <Group gap="sm">
            <Avatar size={40} src={item.avatar} radius={40}/>
        <div>
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
          <Text fz="xs" c="dimmed">
            {item.status}
          </Text>
        </div>
      </Group>
    </Table.Td>
     <Table.Td>
      <Button radius='xl' color='gray' onClick={() => handleAccepteFriend(item.name)}>
        Accept friend
      </Button>
    </Table.Td>
  </Table.Tr>
  ));

  return (
    <div>

        {Object.keys(requestRows).length ?
            requestRows :
            <Table.Tr>
                <Table.Td>
                    <Blockquote color="gray" radius="xl" iconSize={33} mt="xl">
                        No Friend Requests
                    </Blockquote>
                </Table.Td>
            </Table.Tr>
        }
    </div>
  );
}

export default FrindeRequest