import React from 'react';
import Header from '../../../Layout/Header/Header';

function Chat({avatar} : {avatar: string}) {
    return (
        <div>
            <Header avatar={avatar}/>
            <h1>I am the Chat page ---- </h1>
        </div>
    );
}

export default Chat