import React, { useState } from "react";
import { Button, Modal, TextInput, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";

function SerndMessage({name, opened, close}: {name: string, opened: boolean, close: () => void}) {
    const [disabled, setDisabled] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');

    // sent message to server
    const handleSentMessage = async () => {
        await axios.post('message', {name: name, message: message})
        .then(res => {
            if (res.status === 201) {
                console.log("Message sent to server");
                close();
            }
        })
        .catch(err => {
            console.error("Error in send message to server: ", err);
        })
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