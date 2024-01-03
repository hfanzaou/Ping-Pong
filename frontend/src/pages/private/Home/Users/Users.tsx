import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Avatar, Badge, Table, Group, Text, TextInput, ScrollArea, Button, HoverCard } from '@mantine/core';
import UsersInterface from './UsersInterface';
import axios from 'axios';
import testdata from './test.json'
import { IconTent } from '@tabler/icons-react';
import FriendshipButton from './FriendshipButton';

function Users({userList, setUsersList, searchList, setSearchList, handleRequest}: {userList: UsersInterface[], setUsersList: Function, searchList: UsersInterface[], setSearchList: Function, handleRequest: any}) {
//   const [userList, setUsersList] = useState<UsersInterface[]>([]);
//   const [searchList, setSearchList] = useState<UsersInterface[]>([]);
  const [searchInput, setSearchInput] = useState("");
//   const [addButton, setAddButton] = useState<boolean>(false);
  
  useEffect(() => {
    const getUsers = async () => {
      await axios.get("http://localhost:3001/user/list")
      .then((res) => {
        // setUsersList(testdata);
        // setSearchList(testdata);
        setUsersList(res.data);
        setSearchList(res.data);
        console.log("Users list00000-->: ", res.data);
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
  
    console.log(inputValue.length);
    if (inputValue.length > 0) {
      const filtredList = userList.filter((index) => {  // Filter by carachter no need to filter by name
    //   return index.name.match(inputValue);
        return index.name.toLowerCase().includes(inputValue.toLowerCase())
      });
      console.log(filtredList);
      setSearchList(filtredList);
    }
    else{
      setSearchList(userList);
    }
};

  const search = searchList.map((item) => (
      <Table.Tr key={item.name} m={6}>
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
            <Text fz="md" fw={800}>
              {item.name}
            </Text>
            <Text fz="sm" fw={500} c="dimmed">
              {item.state}        {/*this state was need to be real time*/}
            </Text>
          </div>
        </Group>
<div className=''>
            <FriendshipButton name={item.name} friendship={item.friendship} handleRequest={handleRequest}/>
        </div>
    </div>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className='flex flex-col space-y-4'>
        <div className="flex h-5 w-full items-center rounded-md bg-primary p-4">
            <h2 className="mb-2 mt-1 text-4xl font-medium leading-tight text-primary">
              Users
            </h2>
            </div>
            <TextInput className='ml-auto'
              variant="filled"
              radius="md"
              type='search' placeholder='search user' onChange={handleChange} value={searchInput}
              />
    <ScrollArea h={300}>
    <Table verticalSpacing="md" highlightOnHover={true} color='gray' stickyHeader={true} className='h-full w-full'>
          <Table.Tbody>
            {search}
          </Table.Tbody>
      </Table>
        </ScrollArea>
        </div>
  );
}

export default Users;