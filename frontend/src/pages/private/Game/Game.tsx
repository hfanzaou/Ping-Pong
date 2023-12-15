import React from 'react';
import Header from '../../../Layout/Header/Header';

function Game({avatar} : {avatar: string}) {
    return (
        <div>
            <Header avatar={avatar}/>

            <h1>I am the Game page ---- </h1>
        </div>
    );
}

export default Game