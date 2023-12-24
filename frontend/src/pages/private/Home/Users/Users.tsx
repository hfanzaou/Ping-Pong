import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Avatar, Badge, Table, Group, Text, TextInput, ScrollArea, Button, HoverCard } from '@mantine/core';
import UsersInterface from './UsersInterface';
import axios from 'axios';
import data from './test.json'

function Users() {
  const [userList, setUsersList] = useState<UsersInterface[]>([]);
  const [searchList, setSearchList] = useState<UsersInterface[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [addButton, setAddButton] = useState<boolean>(false);
  
  useEffect(() => {
    const getUsers = async () => {
      await axios.get("http://localhost:3001/user/list")
      .then((res) => {
        // setUsersList(data);
        // setSearchList(data);
        setUsersList(res.data);
        setSearchList(res.data);
      }).catch(err => {
        console.error("Error in fetching Users list: ", err);
      })
    };
    getUsers();
}, []);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();
  const inputValue = e.target.value;
  setSearchInput(inputValue);
  
  // console.log(e.target.value);
  
    console.log(inputValue.length);
    if (inputValue.length > 0) {
      const filtredList = userList.filter((index) => {  // Filter by carachter no need to filter by name
      // return index.name.match(inputValue);
        return index.name.toLowerCase().includes(inputValue.toLowerCase())
      });
      console.log(filtredList);
      setSearchList(filtredList);
    }
    else{
      setSearchList(userList);
    }
};

  const handleAddFriend = async (name: string) => {
      console.log(name);
      await axios.post("http://localhost:3001/user/add/friend", {name: name})
      .then((res) => {
        setAddButton(true);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("Error in send post request to add friend ",err);
      })
  };

  const search = searchList.map((item) => (
      <Table.Tr key={item.name}>
      <Table.Td>
        <div className='flex justify-between'>
        <Group gap="sm">
          <HoverCard>
            <HoverCard.Target>
              <Avatar size={40} src={item.avatar} radius={40}/>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              Level {item.level}
            </HoverCard.Dropdown>
          </HoverCard>
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            <Text fz="xs" c="dimmed">
              {item.state}        {/*this state was need to be real time*/}
            </Text>
          </div>
        </Group>

        <Button radius='lg' onClick={() => handleAddFriend(item.name)} disabled={addButton}>
          Add to friends
        </Button>
        </div>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    // <Table.ScrollContainer minWidth={500}>   {/* determin when device larg minWidth larg and when device small minWidth small in media qiuery by talwind*/}
    <div className='flex flex-col space-y-4'>
        {/* <div className="flex h-10 w-full items-center rounded-md bg-primary p-4"> */}
            {/* <h2 className="mb-2 mt-8 text-4xl font-medium leading-tight text-primary">
              Users
            </h2> */}
            <TextInput className='ml-auto'
              variant="filled"
              radius="md"
              type='search' placeholder='search user' onChange={handleChange} value={searchInput}
              />
          {/* </div> */}
    <ScrollArea h={300}>
    <Table verticalSpacing="md" highlightOnHover={true} stickyHeader={true} className='h-full w-full'>
          <Table.Tbody>
            {search}
          </Table.Tbody>
      </Table>
        </ScrollArea>
        </div>
    // </Table.ScrollContainer>
  );
}

export default Users;