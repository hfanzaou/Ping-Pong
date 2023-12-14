import React from "react";
import NavBar from './NavBar'

function Header({setAvatar, avatar} : {setAvatar: Function, avatar: string}) {
    return (
        <div className='sticky top-0 z-50' >
           <NavBar setAvatar={setAvatar} avatar={avatar} />
        </div>
    );
}

export default Header