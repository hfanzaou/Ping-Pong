import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Avatar, Badge, Table, Group, Text, TextInput, ScrollArea, Button, HoverCard } from '@mantine/core';
import UsersInterface from './UsersInterface';
import axios from 'axios';
import data from './test.json'
import { IconTent } from '@tabler/icons-react';

function Users() {
  const [userList, setUsersList] = useState<UsersInterface[]>([]);
  const [searchList, setSearchList] = useState<UsersInterface[]>([]);
  const [searchInput, setSearchInput] = useState("");
//   const [addButton, setAddButton] = useState<boolean>(false);
  

  useEffect(() => {
    const getUsers = async () => {
      await axios.get("http://localhost:3001/user/list")
      .then((res) => {
        // setUsersList(data);
        // setSearchList(data);
        setUsersList(res.data);
        setSearchList(res.data);
        console.log("Users list00000-->: ", res.data);
      }).catch(err => {
        setUsersList(data);
        setSearchList(data);
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

const handleRequest = async (name: string, friendship: string) => {
    console.log("Name from handle Request: ", name);

    if (friendship === 'add friend') {
        const updatedUserList = searchList.map(user => 
            user.name === name 
            ? {...user, friendship: 'pending request'}
            : user
        );
        setUsersList(updatedUserList);
        setSearchList(updatedUserList);
      await axios.post("http://localhost:3001/user/add/friend", {name: name})
      .then((res) => {
        console.log(res.data);
     })
     .catch((err) => {
        console.log("Error in send post request to add friend ",err);
     })
    }else if (friendship === 'pending request') {
        const updatedUserList = userList.map(user => 
            user.name === name 
            ? {...user, friendship: 'add friend'}
            : user
        );
        setUsersList(updatedUserList);
        setSearchList(updatedUserList);
        await axios.post("http://localhost:3001/user/remove/request", {name: name})
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log("Error in send post request to remove request ",err);
        })
    } else if (friendship === 'remove friend') {
        const updatedUserList = userList.map(user => 
            user.name === name 
            ? {...user, friendship: 'add friend'}
            : user
        );
        setUsersList(updatedUserList);
        setSearchList(updatedUserList);
        await axios.post("http://localhost:3001/user/remove/friend", {name: name})
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log("Error in send post request to remove friend ",err);
        })
    }
    // window.location.reload();

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
            <Text fz="md" fw={800}>
              {item.name}
            </Text>
            <Text fz="sm" fw={500} c="dimmed">
              {item.state}        {/*this state was need to be real time*/}
            </Text>
          </div>
        </Group>
<div className='mr-6'>
{/* item.name + ' sent you a friend request'  */}

           <Button  radius='xl' color='gray' aria-disabled onClick={() => handleRequest(item.name, item.friendship)}>
                {item.friendship}
        </Button>
        </div>
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