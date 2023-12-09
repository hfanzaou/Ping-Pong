import React, { useEffect, useState } from "react";
import EditAvatar from "react-avatar-edit";
import { Avatar, Button } from '@mantine/core';
import axios from "axios";

function UpdateAvatar({setUserImage, image, setSave}) {
  const src: any = null;
  // const [preview, setPreview] = useState(null);

  const handleClose = () => {
      // setPreview(null);
      setUserImage(image);
      setSave(true);
  };

  const handleCrop = (view: any) => {
      // setPreview(view);
      setUserImage(view);
      setSave(false);
  };

  return (
    <div className="grid  place-items-center">
      <EditAvatar
        width={200}
        height={100}
        onCrop={handleCrop}
        onClose={handleClose}
        src={src}
      />
      {/* {preview && <img src={preview} />} */}
    </div>
  );
}

function ChangeAvatar() {
  const [setAvatar, setSetAvatar] = useState<boolean>(false);
  const [userimage, setUserImage] = useState<string | undefined>();
  const [image, setImage] = useState<string| undefined>();
  const [save, setSave] = useState<boolean>(true);

  useEffect(() => {
    const getUserInfo = async () => {
      {/* change to get http://localhost:3000/user/avatar*/}
      await axios.get("http://localhost:3001/user/avatar")
      .then((res) => {
          setUserImage(res.data.avatar);
          setImage(res.data.avatar);
      })
      .catch((err) => {
        console.log("Error in geting data in edit profile :", err);
      })
    };
    getUserInfo();
  }, []);

  const handleSetAvatar = () => {
    setSetAvatar(!setAvatar);
  };

  const handleRest = () => {
    setSetAvatar(false);
    setSave(true);
    setUserImage(image);
  };

  {/* Push the Avatar to Api http://localhost:3000/change/avatar/ */}
  const handleSaveAvatar = async () => {
    {userimage !== image ?
    await axios.post('http://localhost:3001/user/avatr', {avatar: (userimage === image ? null : userimage)})
    .then(res => {
      console.log(res.data);
      setSetAvatar(false);
      setSave(true);
    })
    .catch(err => {
      console.error("Error in send profile info: ", err);
    }) :
      setSetAvatar(false);
      setSave(true);}
  };

    return (
      <div className='grid  place-items-center'>
        <Avatar size='xl' onClick={handleSetAvatar}  src={userimage}/>
        {setAvatar && <UpdateAvatar setUserImage={setUserImage} image={image} setSave={setSave} />}
        {!save && <Button onClick={handleRest} >Reset</Button>}
        {!save && <Button onClick={handleSaveAvatar}>Use Avatar</Button>}
      </div>
    );
}

export default ChangeAvatar