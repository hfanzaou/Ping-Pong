import React, { useState } from "react";
import { Button, Card, SimpleGrid, TextInput } from "@mantine/core";
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
                console.log("auth");
                window.location.href = '/';
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
        <div className="h-10"></div>
        <div className='flex justify-center mx-[50px] h-[497px] mt-5 p-5 rounded-xl bg-slate-900 shadow-5'>
            <SimpleGrid className='w-1/2 grid place-items-center'>       
                <Card
                    style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg"
                    >
                <SimpleGrid 
                    spacing='lg'
                    className='grid place-items-center'
                    >
                    <TextInput
                        c='blue'
                        onChange={handleSaveCode}
                        description="Entre Code of Verification"
                        placeholder="entre your 2fa code"
                        error={invalidCode ? "set a valid code" : false}
                        />
                    <Button c={'blur'} color="blue" radius='xl' size="xs" onClick={handleDisableSendCode} disabled={send}>Send</Button>
                </SimpleGrid>
                </Card>
            </SimpleGrid>
        </div>
        </>
    );
}

export  default Auth