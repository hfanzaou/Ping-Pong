import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuDropdown, rem } from "@mantine/core";
import { IconChartInfographic, IconDeviceGamepad2, IconLogout, IconMessages, IconPresentationAnalytics, IconSettings, IconUserCircle } from "@tabler/icons-react";
import { IconHome } from "@tabler/icons-react";
import { IconDashboard } from "@tabler/icons-react";
import iconleadr from "./iconleadr.json";
import axios from "axios";
// import { IconButton, Typography } from "@mui/material";

const pages = ['Home', 'Leaderbord', 'Chat', 'Game', 'Profile'];


function NavigationItem() {
    return (
        <>

        <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
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
          <Menu.Dropdown bg='gray'>
            <Menu.Item  className="text-gray-900 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
                <Link className="flex items-center" to={"/"}><IconHome style={{ width: rem(20), height: rem(20) }} />Home</Link>
            </Menu.Item>
            <Menu.Item className="text-gray-900 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
              <Link className="flex items-center" to={"/Leaderbord"} ><IconDashboard style={{ width: rem(20), height: rem(20) }} />Leaderboard</Link>
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

      <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
       
        {/* <div className="flex flex-shrink-0 items-center text-gray-900">
          Pong Game
        </div> */}

        <div className="hidden md:ml-0 md:block">
          <div className="flex space-x-4">
              <Link to={"/"} className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"><IconHome style={{ width: rem(20), height: rem(20) }} />Home</Link>
              <Link to={"/Leaderbord"} className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"><IconPresentationAnalytics style={{ width: rem(20), height: rem(20) }} />Leaderboard</Link>
              <Link to={"/Profile"} className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"><IconUserCircle style={{ width: rem(20), height: rem(20) }} />Profile</Link>
              <Link to={"/Game"} className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"><IconDeviceGamepad2 style={{ width: rem(20), height: rem(20) }} />Game</Link>
              <Link to={"/Chat"} className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"><IconMessages style={{ width: rem(20), height: rem(20) }} />Chat</Link>
          </div>
        </div>
      
      </div>
        </>
    );
}


const LeftSide = ({avatar} : {avatar: string}) => {
    const [disabled, setDisabled] =  useState<boolean>(false);


    const handleLogout = async () => {
        await axios.get('user/offline');
    }


    return (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-1 xl:ml-1 md:pr-0">

            {/* <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"> */}

        <Menu  position="bottom-end" offset={20}>
            <Menu.Target>
            <button type="button" className="relative rounded-full bg-gray-800  text-gray-400 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>
            </Menu.Target>
            <Menu.Dropdown bg='gray'>
                <div className="h-full w-[300px]">
                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <p className="place-self-start ">User Name</p>
                            <p className="place-item-end">accepte friend</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="place-self-start text-white text-md font-bold">User Name</p>
                            <p className="place-self-end text-gray-400 text-xs">accepte friend</p>
                        </div>
                    </div>
                </div>
            </Menu.Dropdown>
        </Menu>



        <Menu trigger="hover"  openDelay={100} closeDelay={400} opened={disabled} onChange={setDisabled} shadow="md" position="bottom-end" offset={5}>

            <div className="relative ml-3">
            <Menu.Target>
                {/* set all this style butoon to on hover just */}
                {/* <button type="button" className="relative flex rounded-full text-sm hover:bg-white-800 focus:outline-none hover:focus:ring-2 focus:ring-gray focus:ring-offset-2 focus:ring-offset-gray-800"> */}
                <button type="button" className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                  <img className="h-10 w-10 rounded-full" src={avatar} alt="Avatar" />
                </button>
            </Menu.Target>
            <Menu.Dropdown bg='gray'>
              <Menu.Item className="text-gray-900 hover:bg-gray-700 hover:text-white block rounded-md px-2 py-2 text-base font-medium" >
                <Link className="flex items-center"  to={'/setting'}><IconSettings style={{ width: rem(20), height: rem(25) }} /> Settings</Link>
              </Menu.Item>
<<<<<<< HEAD
              <Menu.Item className="text-gray-900 hover:bg-gray-700 hover:text-white block rounded-md px-2 py-2  text-base font-medium" >
                <Link className="flex items-center"  to={`/logout`}><IconLogout style={{ width: rem(20), height: rem(25) }} /> Logout</Link>
=======
              <Menu.Item className="text-gray-900 hover:bg-gray-700 hover:text-white block rounded-md px-2 py-2  text-base font-medium" onClick={handleLogout} >
                <Link className="flex items-center"  to={`${import.meta.env.VITE_API_BASE_URL}logout`}><IconLogout style={{ width: rem(20), height: rem(25) }} /> Logout</Link>
>>>>>>> master
              </Menu.Item>
            </Menu.Dropdown>
            </div>
        </Menu>
        </div>
);        
}


function Nav({avatar} : {avatar: string}) {
    return (
    <div className="bg-gray-800">
        <nav className="bg-slate-900 rounded-full mx-8 mb-4">
            <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <NavigationItem/>
                    <LeftSide avatar={avatar}/>
                </div>
            </div>
        </nav>
    </div>
);
}

export default Nav

