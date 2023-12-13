import { Switch, TextInput, Image, Button } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import QuerCode from '../../../avatarImage/avatar-2.png';

function EnableTowFactor() {
  const [towFactor, setTowFactor] = useState<boolean>(false);
  const [change, setChange] = useState<boolean>(false);
  const [invalidCode, setInvalidCode] = useState<boolean>(true);
  const [qrImage, setQrImage] = useState();

    useEffect(() => {
        const getFactorState = async () => {
            await axios.get("http://localhost:3001/user/2fa")
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
            await axios.get("http://localhost:3001/2fa/turnon")
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
    await axios.post("http://localhost:3001/2fa/auth", {code:"123"})
    .then((res) => {
        console.log(res);

    })
    .catch((err) => {
        console.error("Error in sending 2f code: ", err);
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
            label={!towFactor ? "enable 2f" : "disable 2f"}
            checked={towFactor}
            onChange={handleTowFactor}
        /> :
        (!towFactor ?
            <div>
            <Image src={qrImage}/>
            <TextInput
                label="scane Quire Code and set code here"
                error={invalidCode ? "try again with a valid code" : false}
                // onChange={savw the code in a state}
            />
            <Button onClick={handleSandCode}>Enable</Button> {/*make enable and disable in same butoon input and button in onw component */}
            <Button onClick={handleCancel} >Cancele</Button>
            </div> :
            <div>
            <TextInput
                label="push your 2f code to disable it"
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