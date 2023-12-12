import { Switch, TextInput, Image, Button } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import QuerCode from '../../../avatarImage/avatar-2.png';

function EnableTowFactor() {
  const [towFactor, setTowFactor] = useState<boolean>(false);
  const [change, setChange] = useState<boolean>(false);
  const [invalidCode, setInvalidCode] = useState<boolean>(true);
  const [qrImage, setQrImage] = useState<string>();

    useEffect(() => {
        const getFactorState = async () => {
            await axios.get("http://localhost:3001/user/2fa", {withCredentials: true})
            .then((res) => {
                setTowFactor(res.data);
            })
            .catch((err) => {
                console.error("Error in fetching Tow Factor State: ", err);
            })
        };
        getFactorState();
    }, []);

    const handleTowFactor = async () => {
        setChange(true);

        if (!towFactor) {
            // handle enable it
            await axios.post("http://localhost:3001/2fa/turnon",{body: 'turnon'}, {withCredentials: true})
            .then((res) => {
                setQrImage(res.data.qrcode);
                setChange(true);
            })
            .then((err) => {
                console.error(err);
            })
        }
        // setTowFactor(!towFactor);
  };

  const handleSandCode = async () => {
    // alert(e.target.value);
    setInvalidCode(true);
    await axios.post("http://localhost:3001/2fa/auth", {AuthCode:'254974'}, {withCredentials: true})
    .then((res) => {
        console.log(res);

    })
    .catch((err) => {
        console.log(err);
        console.error("Error in sending 2fa code: ", err);
    })
  };

  
      const handleCancel = () => {
//   useEffect(() => {
            setChange(false);
        // }, []);
        };

  return (
    <div>
        {!change ?
        <Switch
            label={!towFactor ? "enable 2fa" : "disable 2fa"}
            checked={towFactor}
            onChange={handleTowFactor}
        /> :
        (!towFactor ?
            <div>
            <Image src={qrImage}/>
            <TextInput
                label="scan the QR Code and set your code here"
                error={invalidCode ? "try again with a valid code" : false}
               // onChange={{text}}
            />
            <Button onClick={handleSandCode}>Enable</Button> {/*make enable and disable in same butoon input and button in onw component */}
            <Button onClick={handleCancel} >Cancele</Button>
            </div> :
            <div>
            <TextInput
                label="push your 2fa code to disable it"
                error={invalidCode ? "try again with a valid code" : false}
                // onChange={savw the code in a state}

            />
            <Button onClick={handleSandCode}>Disable</Button>
            <Button onClick={handleCancel} >Cancele</Button>

        </div>)
        }
    </div>
  );
}

export default EnableTowFactor