import React, { createRef, useEffect, useState } from "react";
import EditAvatar from "react-avatar-editor";
import { Avatar, Button, Menu } from '@mantine/core';
import axios from "axios";
import Uploadd from "./Upload";

import imageavatar from './avatar-3.png'


// function UpdateAvatar({setUserImage, image, setSave}: {setUserImage: Function, image: string | undefined, setSave: Function}) {
//   // const src: any = null;
//   // const [preview, setPreview] = useState(null);

//   const handleClose = () => {
//       // setPreview(null);
//       setUserImage(image);
//       setSave(true);
//   };

//   const handleCrop = (view: string) => {
//       // setPreview(view);
//       setUserImage(view);
//       setSave(false);
//   };

//   const initImage = image;

//   return (
//     <div className="grid  place-items-center">
//       <EditAvatar
//         width={200}
//         height={100}
//         onCrop={handleCrop}
//         onClose={handleClose}
//         borderStyle={{
//             borderRadius: '10%', 
//             border: '2px solid #ccc', 
//             boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)', 
//             background: '#fff', 
//             // overflow: 'hidden',
//         }}
//         // src={src}
//       />
//       {/* {preview && <img src={preview} />} */}
//     </div>
//   );
// }


function ChangeAvatar({settAvatar, avatar} : {settAvatar: Function, avatar: string}) {
  const [setAvatar, setSetAvatar] = useState<boolean>(false);
  const [userimage, setUserImage] = useState<FormData>();
//   const [image, setImage] = useState<string| undefined>(avatar);
  const [save, setSave] = useState<boolean>(true);

  const [uploaded, setUploaded] = useState<File | null>();
  const fileRef = createRef<HTMLInputElement>();

  const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target?.files?.[0];
    setUploaded(file as File);
    setSave(false);
  }


  const handleSetAvatar: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // fileRef.current?.click()
    setSetAvatar(!setAvatar);
};

  const handleRest = () => {
        setSetAvatar(false);
        setSave(true);
        // setUserImage(null);
        setUploaded(null);
  };

  const handleSaveAvatar = async () => {

    const File = new FormData();
    File.append('file', uploaded as File);
    setUserImage(File);
    setSave(false);


    console.log("userimage: ", userimage);
    //   {userimage !== avatar ?
    await axios.post('http://localhost:3001/settings/avatar', {data: File,  headers: { "Content-Type": "multipart/form-data" }})
    .then(res => {
      console.log(res.data);
      setSetAvatar(false);
      setSave(true);
      settAvatar(userimage);
      setUploaded(null);
      // window.location.reload();
    })
    .catch(err => {

        setUploaded(null);
        setSetAvatar(false);
        setSave(true);
        settAvatar(userimage);

      console.error("Error in send profile info: ", err);
    }) 
    // :
    // setSetAvatar(false);
    // setSave(true);}
  };

  return (
      <div className='grid  place-items-center'>

{!uploaded &&
            <input
                type="file"
                style={{display: 'none'}}
                ref={fileRef}
                onChange={onFileInputChange}
                accept="image/png,image/jpeg,image/gif"
              />
}
<div dir="rtl" className="relative h-32 w-32"  onClick={() => fileRef.current?.click()}>
        <button   type="button" className="relative inline-flex items-center justify-center rounded-full p-1 text-gray-600 hover:bg-gray-900 hover:text-white">
          <Avatar size='xl' src={avatar} />
          <div className="absolute h-14 w-14 top-1 start-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          </div>
        </button>
        </div>
            {/* //  <Uploadd setUploaded={setUploaded} /> */}
{uploaded &&
                    (!save && 
                        <div>
                        <Button color="gray" radius='xl' onClick={handleSaveAvatar}>Set new Avatar</Button>
                        <Button color="gray" radius='xl' onClick={handleRest} >Cancel</Button>
                        </div>
  )}
      </div>
    );
}

export default ChangeAvatar





















const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState();

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);
    console.log("formData: ", formData.get('image'));

    try {
      const response = await axios.post('http://localhost:3001/settings/avatar', formData.get('image'), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error in send profile info: ", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};