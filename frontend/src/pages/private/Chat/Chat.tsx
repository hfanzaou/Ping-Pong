import React from 'react';
import Header from '../../../Layout/Header/Header';

function Chat({setAvatar, avatar} : {setAvatar: Function, avatar: string}) {
    return (
        <div>
            <Header setAvatar={setAvatar} avatar={avatar}/>

        <h1>I am the Chat page ---- </h1>
        </div>
    );
}

export default Chat