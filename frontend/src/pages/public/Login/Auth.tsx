import React, { useState } from "react";
import { Button, Card, TextInput, Text, Title } from "@mantine/core";
import axios from "axios";

function Auth() {
    const [code, setCode] = useState<number>();
    const [invalidCode, setInvalidCode] = useState<boolean>(false);
    const [send, setSend] = useState<boolean>(true);

    const handleDisableSendCode = async () => {
        console.log("this is the code was send: ",code);
        await axios.post("2fa/auth", {AuthCode: code})
        .then((res) => {
            if(res.status == 201)
            {
                window.location.replace('/');
            } else {
                setInvalidCode(true);
            }
        })
        .catch((err) => {
            setInvalidCode(true);
            console.error("Error in sending 2f code In Auth section: ", err);
        })
      };

    const handleSaveCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setInvalidCode(false);
        if (!isNaN(Number(e.target.value)) && e.target.value.length <= 6) {
            e.target.value.length === 6 ? (setCode(Number(e.target.value)), setSend(false)) : setSend(true)
        } else {
            setInvalidCode(true);
        }
    };

    return (
        <>
            <div className="h-[2vh]"></div>
            <div className='flex justify-center m-[50px] p-5 rounded-xl bg-slate-900 shadow-5 h-[80vh]'>
                <div className='grid place-items-center'>
                    <Card 
                        className="flex flex-col items-center space-y-5 rounded-xl"
                        style={{backgroundColor: 'rgb(31 41 55)'}}
                    >
                        <Title size='md' ta='center' c='blue'>
                            Set the authentification code
                        </Title>
                        <TextInput
                            onChange={handleSaveCode}
                            placeholder="entre your 2fa code"
                            error={invalidCode ? "set a valid code" : false}
                            />
                        <Button size="xs" radius='xl' mt={5} color="blue" variant="outline"
                            onClick={handleDisableSendCode}
                            disabled={send}
                        >
                            <Text size="md" ta="center">
                                send
                            </Text>
                        </Button>
                    </Card>
                </div>
            </div>
        </>
    );
}

export  default Auth