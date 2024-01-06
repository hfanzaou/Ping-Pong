import React from "react";
import Nav from './Nav'

function Header({avatar} : {avatar: string}) {
    return (
        <div className='sticky top-0 z-50'>
            <Nav avatar={avatar}/>
        </div>
    );
}

export default Header