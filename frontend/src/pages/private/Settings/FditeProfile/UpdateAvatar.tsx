import React, { useEffect, useState } from "react";
import EditAvatar from "react-avatar-edit";
import { Avatar, Button } from '@mantine/core';
import axios from "axios";

function UpdateAvatar({setUserImage, image, setSave}: {setUserImage: Function, image: string | undefined, setSave: Function}) {
  // const src: any = null;
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
        // src={src}
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
    await axios.post('http://localhost:3001/settings/avatar', {avatar: (userimage === image ? null : userimage)})
    .then(res => {
      console.log(res.data);
      setSetAvatar(false);
      setSave(true);
      window.location.reload();
    })
    .catch(err => {
      console.error("Error in send profile info: ", err);
    }) :
      setSetAvatar(false);
      setSave(true);}
  };

    return (
      <div className='grid  place-items-center'>
        <div dir="rtl" className="relative h-32 w-32" onClick={handleSetAvatar}>
          <Avatar size='xl' src={userimage} />
          <div className="absolute h-14 w-14 top-0 start-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          </div>
        </div>
        {setAvatar && <UpdateAvatar setUserImage={setUserImage} image={image} setSave={setSave} />}
        {!save && <Button onClick={handleRest} >Cancel</Button>}
        {!save && <Button onClick={handleSaveAvatar}>Set new Avatar</Button>}
      </div>
    );
}

export default ChangeAvatar