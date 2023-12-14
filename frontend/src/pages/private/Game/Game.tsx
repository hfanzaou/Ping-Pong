import React from 'react';
import Header from '../../../Layout/Header/Header';

function Game({setAvatar, avatar} : {setAvatar: Function, avatar: string}) {
    return (
        <div>
            <Header setAvatar={setAvatar} avatar={avatar}/>

            <h1>I am the Game page ---- </h1>
        </div>
    );
}

export default Game