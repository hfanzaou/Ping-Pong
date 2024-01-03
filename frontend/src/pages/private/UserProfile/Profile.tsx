import React, { useEffect, useState } from 'react'
import {Container, ScrollArea, SimpleGrid} from '@mantine/core'
import UserCard  from './ProfileInfo/UserCard'
import MatchHistory from './MatchHistory/MatchHistory'
import Achievements from './Achievements/Achievement'
import Header from '../../../Layout/Header/Header'
import Footer from '../../../Layout/Footer/Footer'
import axios from 'axios'

export function ProfileSections({handleRequest, friendShip}: {handleRequest: any, friendShip: string}) {
    const name = window.location.pathname.split("/")[1];  // get the name from the url use this and remove the userName from the props and cookies storage
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        // console.log("name: in public profile fitcheng data", name);
        const getUserProfile = async () => {
            await axios.get("http://localhost:3001/user/profile", {params: {name: name}})
            .then((res) => {
                setProfile(res.data);
                console.log("user profile: ", res.data);
            })
            .catch((err) => {
                console.error("error when send get request to get user profile: ", err);
            })
        };
        getUserProfile();
    }, []);

    
    // console.log("user profile: ", profile?.achievements);

    return (
      <div>
        <SimpleGrid
              cols={{ base: 1, sm: 1, lg: 2 }}
              spacing={{ base: 10, sm: 'xl', lg: 'xl' }}
              verticalSpacing={{ base: 'xl', sm: 'xl', lg: 'xl' }}
        >
          <UserCard usercard={profile?.usercard} handleRequest={handleRequest} friendShip={friendShip} />
          {/* <UserCard userName={profile?.username} avatar={profile?.avatar} level={profile?.level} win={5} losses={6} /> */}
          <Achievements achievement={profile?.achievements} />
          <MatchHistory matchhistory={profile?.matchhistory}/>
        </SimpleGrid>
      </div>
    );
}

function Profile({handleRequest, friendShip}: {handleRequest: any, friendShip: string}) {
    return (
        // <div  className='h-full ml-8 mr-8 pr-8 pl-8 '>
            <div>
            {/* <Header avatar={avatar}/> */}
             <div className=' ml-4 mr-4 pr-4 pl-4 mb-8 pb-8'> 
                <ProfileSections handleRequest={handleRequest} friendShip={friendShip}/>
             </div> 
            <Footer/>
        </div>
    );
}

export default Profile