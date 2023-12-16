import { Switch, TextInput, Image, Button } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import QuerCode from '../../../avatarImage/avatar-2.png';

function EnableTowFactor() {
  const [towFactor, setTowFactor] = useState<boolean>();
  const [change, setChange] = useState<boolean>(false);
  const [invalidCode, setInvalidCode] = useState<boolean>(false);
  const [qrImage, setQrImage] = useState();
  const [code, setCode] = useState<number>();
  const [disabled, setDisabled] = useState<boolean>(true);

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
            await axios.post("http://localhost:3001/2fa/turnon")
            .then((res) => {
                console.log(res.data);
                setQrImage(res.data);
                setChange(true);
            })
            .catch((err) => {
                console.error(err);
            })
        }
  };

  const handleSaveCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setInvalidCode(false);
    if (!isNaN(Number(e.target.value)) && e.target.value.length <= 6) {
        e.target.value.length === 6 ? (setCode(Number(e.target.value)), setDisabled(false)) : setDisabled(true)
    } else {
        setInvalidCode(true);
    }
  };

  const handleEnableSendCode = async () => {
    console.log("this is the code was send: ",code);
    await axios.post("http://localhost:3001/2fa/auth", {AuthCode: code})
    .then((res) => {
        // make the needed work when the code valid {reload the page to get the correct state of 2fa}
        res.status === 201 && window.location.reload();
    })
    .catch((err) => {
        setInvalidCode(true);
        console.error("Error in sending 2f code: ", err);
    })
  };

  const handleDisableSendCode = async () => {
    console.log("this is the code was send: ",code);
    await axios.post("http://localhost:3001/2fa/turnoff", {AuthCode: code})
    .then((res) => {
        // make the needed work when the code valid {reload the page to get the correct state of 2fa}
        res.status === 201 && window.location.reload();
    })
    .catch((err) => {
        setInvalidCode(true);
        console.error("Error in sending 2f code: ", err);
    })
  };

    const handleCancel = () => {
        setChange(false);
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
                onChange={handleSaveCode}
                label="scane Quire Code and set code here"
                error={invalidCode ? "try again with a valid code" : false}
            />
            <Button onClick={handleEnableSendCode} disabled={disabled}>Enable</Button> {/*make enable and disable in same butoon input and button in onw component */}
            <Button onClick={handleCancel} >Cancel</Button>
            </div> :
            <div>
            <TextInput
                onChange={handleSaveCode}
                label="push your 2f code to disable it"
                error={invalidCode ? "set a valid code" : false}
            />
            <Button onClick={handleDisableSendCode} disabled={disabled}>Disable</Button>
            <Button onClick={handleCancel} >Cancel</Button>
        </div>)
        }
    </div>
  );
}

export default EnableTowFactor