import React from "react";
import NavBar from './NavBar'
import Nav from './Nav'

function Header({avatar} : {avatar: string}) {
    return (
        <div className='sticky top-0 z-50' >
           <NavBar avatar={avatar} />
           {/* <Nav/> */}
        </div>
    );
}

export default Header