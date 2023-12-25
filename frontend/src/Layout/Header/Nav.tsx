import React, { useState } from "react"
import { Link } from "react-router-dom";
import avatar from "./avatar-2.png";
import { Menu, MenuDropdown, rem } from "@mantine/core";
import { IconDeviceGamepad2, IconLogout, IconMessages, IconSettings, IconUserCircle } from "@tabler/icons-react";
import { IconHome } from "@tabler/icons-react";
import { IconDashboard } from "@tabler/icons-react";
// import { IconButton, Typography } from "@mui/material";

const pages = ['Home', 'Leaderbord', 'Chat', 'Game', 'Profile'];


function NavigationItem() {
    return (
        <>

        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <Menu shadow="md" position="bottom-start" trigger="hover" openDelay={100} closeDelay={400} offset={12}>
            <Menu.Target>

        {/* <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false"> */}
        <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white" aria-controls="mobile-menu" aria-expanded="false">
        
          {/* <!--
              Icon when menu is closed.

              Menu open: "hidden", Menu closed: "block"
            --> */}

          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          {/* <!--
            Icon when menu is open.
            
            Menu open: "block", Menu closed: "hidden"
          --> */}
          <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        </button>
            </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item  className="text-gray-900 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
                <Link className="flex items-center" to={"/"}><IconHome style={{ width: rem(20), height: rem(20) }} />Home</Link>
            </Menu.Item>
            <Menu.Item className="text-gray-900 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
              <Link className="flex items-center" to={"/Leaderbord"} ><IconDashboard style={{ width: rem(20), height: rem(20) }} />Dashboard</Link>
            </Menu.Item >
            <Menu.Item className="text-gray-900 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
              <Link className="flex items-center" to={"/Profile"} ><IconUserCircle style={{ width: rem(20), height: rem(20) }} />Profile</Link>
            </Menu.Item>
            <Menu.Item className="text-gray-900 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
              <Link className="flex items-center" to={"/Game"} ><IconDeviceGamepad2 style={{ width: rem(20), height: rem(20) }} />Game</Link>
            </Menu.Item>
            <Menu.Item className="text-gray-900 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
              <Link className="flex items-center" to={"/Chat"} ><IconMessages style={{ width: rem(20), height: rem(20) }} />Chat</Link>
            </Menu.Item>
          </Menu.Dropdown>

        </Menu>
      </div>

      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
       
        {/* <div className="flex flex-shrink-0 items-center text-gray-900">
          Pong Game
        </div> */}

        <div className="hidden sm:ml-6 sm:block">
          <div className="flex space-x-4">
              <Link to={"/"} className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"><IconHome style={{ width: rem(20), height: rem(20) }} />Home</Link>
              <Link to={"/Leaderbord"} className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"><IconDashboard style={{ width: rem(20), height: rem(20) }} />Dashboard</Link>
              <Link to={"/Profile"} className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"><IconUserCircle style={{ width: rem(20), height: rem(20) }} />Profile</Link>
              <Link to={"/Game"} className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"><IconDeviceGamepad2 style={{ width: rem(20), height: rem(20) }} />Game</Link>
              <Link to={"/Chat"} className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"><IconMessages style={{ width: rem(20), height: rem(20) }} />Chat</Link>
          </div>
        </div>
      
      </div>
        </>
    );
}


const LeftSide = ({avatar} : {avatar: string}) => {
    const [disabled, setDisabled] =  useState<boolean>(false);

    return (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

            {/* <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"> */}
            <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white">
            
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>
        <Menu trigger="hover"  openDelay={100} closeDelay={400} opened={disabled} onChange={setDisabled} shadow="md" position="bottom-end" offset={12}>

            <div className="relative ml-3">
            <Menu.Target>
                {/* set all this style butoon to on hover just */}
                {/* <button type="button" className="relative flex rounded-full text-sm hover:bg-white-800 focus:outline-none hover:focus:ring-2 focus:ring-gray focus:ring-offset-2 focus:ring-offset-gray-800"> */}
                <button type="button" className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                  <img className="h-10 w-10 rounded-full" src={avatar} alt="Avatar" />
                </button>
            </Menu.Target>
  
            <Menu.Dropdown>
              <Menu.Item className="text-gray-900 hover:bg-gray-700 hover:text-white block rounded-md px-2 py-2 text-base font-medium" >
                <Link className="flex items-center"  to={'/setting'}><IconSettings style={{ width: rem(20), height: rem(25) }} /> Settings</Link>
              </Menu.Item>
              <Menu.Item className="text-gray-900 hover:bg-gray-700 hover:text-white block rounded-md px-2 py-2  text-base font-medium" >
                <Link className="flex items-center"  to={'http://localhost:3001/logout'}><IconLogout style={{ width: rem(20), height: rem(25) }} /> Logout</Link>
              </Menu.Item>
            </Menu.Dropdown>
            </div>
        </Menu>
        </div>
);        
}


function Nav({avatar} : {avatar: string}) {
    return (
        <header className="">

        <nav className="bg-gray-800 rounded-full mx-4">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <NavigationItem/>
            <LeftSide avatar={avatar}/>
          </div>
        </div>
    </nav>
        </header>
);
}

export default Nav

