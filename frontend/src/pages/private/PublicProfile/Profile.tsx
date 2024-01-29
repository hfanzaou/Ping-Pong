import React, { useEffect, useState } from 'react'
import {Button, Card, Container, Group, LoadingOverlay, ScrollArea, SimpleGrid, Text, Title} from '@mantine/core'
import UserCard  from './ProfileInfo/UserCard'
import MatchHistory from './MatchHistory/MatchHistory'
import Achievements from './Achievements/Achievement'
import Header from '../../../Layout/Header/Header'
// import Footer from '../../../Layout/Footer/Footer'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import data from './MatchHistory/test.json'
import Buttons from './Buttons/Buttons'

import image from './assite/bg.gif'
import { Socket } from 'socket.io-client'

export function ProfileSections({profileName, handleRequest, friendShip, socket}: {profileName: string | undefined, handleRequest: any, friendShip: string, socket: Socket}) {
    // const name = window.location.pathname.split("/")[1];  // get the name from the url use this and remove the userName from the props and cookies storage
    const [profile, setProfile] = useState<any>(null);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [userName, setUserName] = useState<string>();

    useEffect(() => { // Just to check if the same user profile or not to show the friendship button or not
        const getUserNmae = async () => {
            await axios.get("user/name")
            .then((res) => {
                setUserName(res.data.name);
            })
            .catch((err) => {
                console.log("Error in geting data in edit profile :", err);
            })
        };
        getUserNmae();
    }, []);

    useEffect(() => {
        // console.log("name: in public profile fitcheng data", name);
        const getUserProfile = async () => {
            await axios.get("user/profile", {params: {name: profileName}})
            .then((res) => {
                if (res.status === 200) {
                    setProfile(res.data);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                // if (err.response.status === 404) {
                    setNotFound(true);
                    setIsLoading(false);
                // }
                console.error("error when send get request to get user profile: ", err);
            })
        };
        getUserProfile();
    }, []);

    // if (isLoading)
    //     return (
    //         <div className="flex justify-center items-center">
    //             <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900">
    //              <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
    //             </div>
    //         </div>
    //     );

    if (notFound)
        return (
            <Container h={430}>
                <Title ta='center' m={5} size='xl' >User not found</Title>
                <Text size='xl' bg='red' ta='center' className='rounded-md' >404</Text>
            </Container>
        );

    return (
        <SimpleGrid
              cols={{ base: 1, xs: 1, md: 2, lg: 2 }}
              spacing={'md'}
        >
            <SimpleGrid
                cols={{ base: 1, xs: 1, md: 2, lg: 2 }}
                spacing={'md'}
            >
                <UserCard usercard={profile?.usercard} handleRequest={handleRequest} friendShip={friendShip}/>
                {profile?.usercard.username !== userName ?
                    <Buttons profile={profile} handleRequest={handleRequest} friendShip={friendShip} socket={socket}/> :
                    <img  className='h-full rounded-xl' src={image} /> // make this image in the same color as app
                }
            </SimpleGrid>
            <div>
                <Achievements  achievement={profile?.achievements}/>
                <MatchHistory matchhistory={profile?.matchhistory} />
            </div>
        </SimpleGrid>
    );
}

function Profile({profileName, handleRequest, friendShip, socket}: {profileName: string | undefined, handleRequest: any, friendShip: string, socket: Socket}) {

    console.log("profileName: ", profileName);
    return (
        <div className='mx-[50px] mt-[20px] p-5 rounded-xl bg-slate-900 shadow-5'>
            <ProfileSections profileName={profileName} handleRequest={handleRequest} friendShip={friendShip} socket={socket}/>
        </div>
    );
}

export default Profile