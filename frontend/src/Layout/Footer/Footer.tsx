import React from "react";
import { Avatar, Card } from "@mantine/core";

function Footer() {
    return (
        <div className="flex justify-center items-center space-x-10 mt-5">
            <div className="flex flex-col items-center justify-center py-4 text-gray-400 ">
                <p className="text-sm">ft_trancendence</p>
                <p className="text-sm">made by ♡ with</p>
            </div>
            <div className="flex items-center space-x-5">
                <Avatar size='8vh' radius='md' src='https://cdn.intra.42.fr/users/a20a415122c250b00685308ae3909e21/hfanzaou.jpg'/>
                <Avatar size='8vh' radius='md' src='https://cdn.intra.42.fr/users/e309a3cba8f23ed14b44f453ff827085/ajana.jpg'/>
                <Avatar size='8vh' radius='md' src='https://cdn.intra.42.fr/users/4a7006c8b7336b000e1cfaab5db88538/ebensalt.jpg'/>
                <Avatar size='8vh' radius='md' src='https://cdn.intra.42.fr/users/0aab98ac802b6cd5ef94b9c3ea1b0699/rarahhal.jpg'/>
            </div>
        </div>
    );
}

export default Footer;