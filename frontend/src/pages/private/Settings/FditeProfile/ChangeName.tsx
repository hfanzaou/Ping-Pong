import React, { useEffect, useState } from 'react';
import { TextInput, Button } from '@mantine/core';
import axios from 'axios';

function ChangeName() {
  const [username, setUserName] = useState<string>();
  
  const [uniqueName, setUniqueNmae] = useState<string>('');
  
  const [invalidName, setInvalidName] = useState<boolean>(false);

  const [save, setSave] = useState<boolean>(true);

  const [openChangeName, setOpenChangeName] = useState<boolean>(true);

  useEffect(() => {
    const getUserInfo = async () => {
      {/* change to get http://localhost:3001/user/name*/}
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
    e.target.value.length > 4 ? setSave(false) : setSave(true);
  };

  {/* Push the Unique Name and the Avatar to Api http://localhost:3001/change/name*/}
  const handleSaveName = async () => {
    await axios.post('http://localhost:3001/settings/name', {uniqueName: uniqueName})
    .then(res => {
      console.log(res.data);
      {res.status != 201 ? (setInvalidName(true)) : (setInvalidName(false), setOpenChangeName(!openChangeName))}
    })
    .catch(err => {
      // setOpenChangeName(!openChangeName); when the name Valide change it and close name setting in then scop
      console.error("Error in send profile info: ", err);
    })
  };

  const handleOpenChangeName = () => {
    setOpenChangeName(!openChangeName);
  };

  const handleCloseChangeName = () => {
    setOpenChangeName(!openChangeName);
  };

  return (
    <>
    <h1>{username}</h1>
    {openChangeName ? 
    <>
    <Button
      onClick={handleOpenChangeName}
      >
      Change Name
    </Button>
      </> :
    <>    
    <TextInput
    // label={username}
    placeholder="Unique Name"
    description="change your name by set a uniuqe name hase more then 4 charachter"
    onChange={handleChangeName}
    error={invalidName ? "alredy used": false}
    />
    <Button type="button" onClick={handleSaveName} disabled={save} >Save Name</Button>
    <Button onClick={handleCloseChangeName}>Cancele</Button>
    </>
    }
    </>
  );
}

export default ChangeName