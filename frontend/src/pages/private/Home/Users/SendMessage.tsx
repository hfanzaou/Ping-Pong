import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Textarea } from "@mantine/core";
import { Socket } from "socket.io-client";

function SerndMessage({name, opened, close, socket}: {name: string, opened: boolean, close: () => void, socket: Socket}) {
    const [disabled, setDisabled] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const   nameRef = useRef(name);

    nameRef.current = name;
    function callBack() {
        console.log(nameRef.current);
        socket.emit("newUser", nameRef.current);
        socket.emit(
            "addnotification",
            {reciever: nameRef.current, type: "chat"}
        );
    }
    useEffect(() => {
        socket.on("DONE", callBack);
        return () => {
            socket.off("DONE", callBack);
        }
    }, []);
    const handleSentMessage = () => {
        socket.emit("directTmp", { recver: name, message: message });
        setDisabled(true);
        close();
    };

    const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.currentTarget.value);
        e.currentTarget.value.length > 0 ? setDisabled(false) : setDisabled(true);
    };

    const handleClose = () => {
        setDisabled(true);
        close();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            withCloseButton={false}
            radius='lg' 
            c={'blue'}
            centered={true}
            style={{backgroundColor: 'rgb(31 41 55)'}}
        >
            <div className='flex flex-col justify-center'>
                <Textarea
                    variant="filled"
                    label={name}
                    description="send a message to him"
                    placeholder="enter your message"
                    onChange={(e) => handleChangeMessage(e)}
                />
                <div className='mt-5'>
                    <Button
                        mr='sm'
                        radius={'xl'}
                        color='green'
                        size='xs'
                        onClick={handleSentMessage}
                        disabled={disabled}
                    >
                        Sent Message
                    </Button>
                    <Button
                        radius={'xl'}
                        size='xs'
                        color='yellow'
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default SerndMessage