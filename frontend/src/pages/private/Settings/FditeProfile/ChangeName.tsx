import React, { useEffect, useState } from 'react';
import { TextInput, Button } from '@mantine/core';
import axios from 'axios';
import { IconEdit } from '@tabler/icons-react';

function ChangeName() {
  const [username, setUserName] = useState<string>();
  
  const [uniqueName, setUniqueNmae] = useState<string>('');
  
  const [invalidName, setInvalidName] = useState<boolean>(false);

  const [save, setSave] = useState<boolean>(true);

  const [openChangeName, setOpenChangeName] = useState<boolean>(true);

  useEffect(() => {
    const getUserInfo = async () => {
      await axios.get("http://localhost:3001/user/name")
      .then((res) => {
          console.log(res.data.name);
          setUserName(res.data.name);
      })
      .catch((err) => {
        console.log("Error in geting data in edit profile :", err);
      })
    };
    getUserInfo();
  }, []);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUniqueNmae(e.target.value);
    setInvalidName(false);
    e.target.value.length > 4 ? setSave(false) : setSave(true);
  };

  {/* Push the Unique Name and the Avatar to Api http://localhost:3001/change/name*/}
  const handleSaveName = async () => {
    await axios.post('http://localhost:3001/settings/name', {uniqueName: uniqueName})
    .then(res => {
      console.log(res.data);
      {res.status != 201 ? (setInvalidName(true)) : (setInvalidName(false), setOpenChangeName(!openChangeName), setUserName(uniqueName))}
    })
    .catch(err => {
        setInvalidName(true);
        // setOpenChangeName(!openChangeName); when the name Valide change it and close name setting in then scop
        console.error("Error in send profile info: ", err);
    })
};

const handleOpenChangeName = () => {
    setSave(true);
    setOpenChangeName(!openChangeName);
  };

  const handleCloseChangeName = () => {
    setSave(true);
    setOpenChangeName(!openChangeName);
  };

  return (
    <div>
    {/* <h1 >{username}</h1> */}
    {openChangeName ? 
    // <>
          <div className='grid  '>
        <div dir="rtl" className="relative h-32 w-32" >

    <Button
        radius={'xl'}
        color='gray'
    // className="text-white bg-gray-800 hover:bg-gray-700 hover:text-white block rounded-full px-2 py-2 text-base font-medium"
      onClick={handleOpenChangeName}
      >
        <div className='m-3'></div>
        {username}
      {/* Change Name */}
          <div className="absolute top-0 right-0 h-16 w-16">
            <IconEdit/>
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg> */}
          </div>
            </Button>
        </div>
        </div>
    //   </>
       :
    <>    
    <TextInput
    // label={username}
    placeholder="Unique Name"
    description="change your name by set a uniuqe name hase more then 4 charachter"
    onChange={handleChangeName}
    error={invalidName ? "alredy used": false}
    />

    <Button
    ml={130}
    mt={10}
    radius={'xl'}
    color='gray'
    type="button" 
    onClick={handleSaveName} 
    disabled={save} 
    >
        Save Change
    </Button>
    <Button 
    mt={10}
    ml={5}
    radius={'xl'}
    
    color='gray'
    onClick={handleCloseChangeName}
    >
        Cancel
    </Button>
    </>
    }
    </div>
  );
}

export default ChangeName