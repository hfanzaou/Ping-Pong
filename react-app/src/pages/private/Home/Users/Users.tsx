import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Table, Group, Text, TextInput, ScrollArea } from '@mantine/core';
import UsersInterface from './UsersInterface';
import axios from 'axios';
import searchBar  from './SearchBar';

const rolesData = ['Manager', 'Collaborator', 'Contractor'];

function UsersRolesTable() {
  const [userList, setUsersList] = useState<UsersInterface[]>([]);
  const [searchList, setSearchList] = useState<UsersInterface[]>([]);
  const [searchInput, setSearchInput] = useState("");
  
  useEffect(() => {
    const getUsers = async () => {
      await axios.get("http://localhost:3001/user/list")
      .then((res) => {
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

  const search = searchList.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={40} src={item.avatar} radius={40} />
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            <Text fz="xs" c="dimmed">
              {item.email}
            </Text>
          </div>
        </Group>
      </Table.Td>
      {/* <Table.Td>{item.lastActive}</Table.Td> */}
      <Table.Td>
        {item.active ? (
          <Badge fullWidth variant="light">
            Online
          </Badge>
        ) : (
          <Badge color="gray" fullWidth variant="light">
            Ofline
          </Badge>
        )}
      </Table.Td>
    </Table.Tr>
  ));
  
  return (
    // <Table.ScrollContainer minWidth={500}>   {/* determin when device larg minWidth larg and when device small minWidth small in media qiuery by talwind*/}
      <Table verticalSpacing="sm" highlightOnHover={true} >
        <Table.Thead>
          <div className="flex h-10 w-full items-center rounded-md bg-primary p-4">
            <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">Users</h2>
            <TextInput className='ml-auto'
              variant="filled"
              radius="md"
              type='search' placeholder='search user' onChange={handleChange} value={searchInput}
            />
          </div>
        </Table.Thead>
        <ScrollArea h={250}>
          <Table.Tbody>
            {search}
          </Table.Tbody>
        </ScrollArea>
      </Table>
    // </Table.ScrollContainer>
  );
}

export default UsersRolesTable;