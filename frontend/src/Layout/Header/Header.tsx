import React from "react";
import NavBar from './NavBar'

function Header({avatar} : {avatar: string}) {
    return (
        <div className='sticky top-0 z-50' >
           <NavBar avatar={avatar} />
        </div>
    );
}

export default Header