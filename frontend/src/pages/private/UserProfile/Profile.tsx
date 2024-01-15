import React, { useEffect, useState } from 'react'
import {Button, Container, Group, LoadingOverlay, ScrollArea, SimpleGrid, Text, Title} from '@mantine/core'
import UserCard  from './ProfileInfo/UserCard'
import MatchHistory from './MatchHistory/MatchHistory'
import Achievements from './Achievements/Achievement'
import Header from '../../../Layout/Header/Header'
import Footer from '../../../Layout/Footer/Footer'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import data from './MatchHistory/test.json'

export function ProfileSections({profileName, handleRequest, friendShip}: {profileName: string | undefined, handleRequest: any, friendShip: string}) {
    // const name = window.location.pathname.split("/")[1];  // get the name from the url use this and remove the userName from the props and cookies storage
    const [profile, setProfile] = useState<any>(null);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // console.log("name: in public profile fitcheng data", name);
        const getUserProfile = async () => {
            await axios.get("user/profile", {params: {name: profileName}})
            .then((res) => {
                if (res.status === 200) {
                    setProfile(res.data);
                    console.log("user profile: ", res.data);
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
            <Container  mb={200} m={200}>
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
                <UserCard usercard={profile?.usercard} handleRequest={handleRequest} friendShip={friendShip} />
                {/* <Card  style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg">

                    <UsersRelation socket={socket} setUrlName={setUrlName}/>
                </Card> */}
            </SimpleGrid>
            <div>
                <Achievements  achievement={profile?.achievements}/>
                {/* <MatchHistory matchhistory={profile?.matchhistory} /> */}
                <MatchHistory matchhistory={data}/>
            </div>
        </SimpleGrid>
    );
}

function Profile({profileName, handleRequest, friendShip}: {profileName: string | undefined, handleRequest: any, friendShip: string}) {

    console.log("profileName: ", profileName);
    return (
            <div className='mx-[50px] mt-[20px] p-5 rounded-xl bg-slate-900 shadow-5'>
                <ProfileSections profileName={profileName} handleRequest={handleRequest} friendShip={friendShip}/>
             </div>
    );
}

export default Profile