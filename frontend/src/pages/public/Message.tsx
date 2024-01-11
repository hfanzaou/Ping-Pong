import React, { useState } from "react";
import io from "socket.io-client";

function Message() {
    const [message, setMessage] = useState("");
    const socket = io("http://192.168.1.114:3001/");

    const handleSendMessage = () => {
        console.log("Message sent");
    }
    return (
        <div className="flex items-center">
            <input placeholder="Message..."
                onChange={(e) => setMessage(e.target.value)}
            />
            <button 
                onClick={() => {handleSendMessage}}
            >
                Send Message
            </button>
        </div>
    );
}

export default Message;