import { Switch, TextInput, Image, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import QuerCode from '../../../avatarImage/avatar-2.png';

function EnableTowFactor() {
  const [towFactor, setTowFactor] = useState<boolean>();
//   const [change, setChange] = useState<boolean>(false);
  const [invalidCode, setInvalidCode] = useState<boolean>(false);
  const [qrImage, setQrImage] = useState();
  const [code, setCode] = useState<string>();
  const [disabled, setDisabled] = useState<boolean>(true);

  const [opened, { open, close }] = useDisclosure(false);


    const getFactorState = async () => {
        await axios.get("user/2fa")
        .then((res) => {
            setTowFactor(res.data);
        })
        .catch((err) => {
            console.error("Error in fetching Tow Factor State: ", err);
        })
    };

    useEffect(() => {
        getFactorState();
    }, []);

    const handleTowFactor = async () => {
        open();
        if (!towFactor) {
            // handle enable it
            await axios.post("2fa/turnon")
            .then((res) => {
                setQrImage(res.data);

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
            e.target.value.length === 6 ? (setCode(e.target.value), setDisabled(false)) : setDisabled(true)
        } else {
            setDisabled(true)
            setInvalidCode(true);
        }
    };

    const handleEnableSendCode = async () => {
        await axios.post("2fa/auth", {AuthCode: code})
        .then((res) => {
            if(res.status == 201) {
                getFactorState();
                setDisabled(true);
                close();
            }
        })
        .catch((err) => {
            setInvalidCode(true);
            console.error("Error in sending 2f code: ", err);
        })
    };


    const handleDisableSendCode = async () => {
        await axios.post("2fa/turnoff", {AuthCode: code})
        .then((res) => {
            if (res.status == 201) {
                // setChange(false);
                getFactorState();
                setDisabled(true);
                close();
            }
        })
        .catch((err) => {
            setInvalidCode(true);
            setDisabled(true);
            console.error("Error in sending 2f code: ", err);
        })
    };

    const handleCancel = () => {
        setInvalidCode(false);
        setDisabled(true);
        // setChange(false);
        close();
    };

    return (
        <div className="static">
            <Button
                size="sm"
                radius={'xl'}
                color={towFactor ? 'red' : 'green'}
                onClick={handleTowFactor}
            >
                {!towFactor ? "enable 2f" : "disable 2f"}
            </Button>
            <Modal 
                opened={opened} 
                onClose={handleCancel}
                withCloseButton={false}
                radius='lg' 
                c={'blue'}
                centered={true}
                style={{backgroundColor: 'rgb(31 41 55)'}}
            >
                {(!towFactor ?
                    <div>
                        <img alt="qr code" className="h-40 w-40 mx-auto" src={qrImage}/>
                        <TextInput
                            onChange={handleSaveCode}
                            label="scane Quire Code and set code here"
                            error={invalidCode ? "try again with a valid code" : false}
                        />
                        <div className='mt-5'>
                            <Button
                                size="xs"
                                radius={'xl'}
                                color='green'
                                onClick={handleEnableSendCode} 
                                disabled={disabled}
                            >
                                Enable
                            </Button> {/*make enable and disable in same butoon input and button in onw component */}
                            <Button
                                size="xs"
                                radius={'xl'}
                                color='yellow'
                                onClick={handleCancel}
                                >
                                Cancel
                            </Button>
                        </div>
                    </div> :
                    <div>
                        <TextInput
                            onChange={handleSaveCode}
                            label="push your 2f code to disable it"
                            error={invalidCode ? "set a valid code" : false}
                        />
                        <div className='mt-5'>
                            <Button 
                                mr='sm'
                                size="xs"
                                radius={'xl'}
                                color='red'
                                onClick={handleDisableSendCode} 
                                disabled={disabled}
                            >
                                Disable
                            </Button>
                            <Button 
                                size="xs"
                                radius={'xl'}
                                color='yellow'
                                onClick={handleCancel} 
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>)}
            </Modal>
        </div>
    );
}

export default EnableTowFactor