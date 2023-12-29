import React from 'react';
import Header from '../../../Layout/Header/Header';

function Chat({avatar} : {avatar: string}) {
    return (
        <div>
            <Header avatar={avatar}/>
            <div className=''>
                <h1>I am the Chat page ---- </h1>
            </div>
        </div>
    );
}

export default Chat