import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Table, Group, Text, TextInput, ScrollArea, Button, HoverCard } from '@mantine/core';
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
          <HoverCard>
            <HoverCard.Target>
              <Avatar size={40} src={item.avatar} radius={40}/>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              {item.level}
            </HoverCard.Dropdown>
          </HoverCard>
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            <Text fz="xs" c="dimmed">
              {item.state}
            </Text>
          </div>
        </Group>
      </Table.Td>
      {/* <Table.Td>{item.lastActive}</Table.Td> */}
      <Table.Td>
        <Button>Add to friends</Button>
        {/* {item.active ? (
          <Badge fullWidth variant="light">
            Online
          </Badge>
        ) : (
          <Badge color="gray" fullWidth variant="light">
            Ofline
          </Badge>
        )} */}
      </Table.Td>
    </Table.Tr>
  ));
  
  return (
    // <Table.ScrollContainer minWidth={500}>   {/* determin when device larg minWidth larg and when device small minWidth small in media qiuery by talwind*/}
      <Table verticalSpacing="sm" highlightOnHover={true} >
        <Table.Thead>
          <div className="flex h-10 w-full items-center rounded-md bg-primary p-4">
            <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">
              Users
            </h2>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
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