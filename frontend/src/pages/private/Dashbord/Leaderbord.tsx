import React, { useEffect, useState } from "react";
import Header from "../../../Layout/Header/Header";
import Footer from '../../../Layout/Footer/Footer';
import LeaderBordCard from "./LeaderBordCard";
import LeaderbordTable from "./LeaderBordTable";
import axios from "axios";
import leaderboardInterface from "./Leaderboard";
import { Card, SimpleGrid } from "@mantine/core";

function Leaderbord({avatar} : {avatar: string}) {
    const [data, setData] = useState<leaderboardInterface[]>([]);

    const getData = async () => {
        await axios.get('user/leaderboard')
        .then((res) => {
            setData(res.data);
            console.log("res.data: ", res.data);
        }).catch((err) => {
            console.log("error in fetching leadrbord data: ", err);
        })
    };
    
    useEffect(() => {
        getData();
    }, []);
    
    console.log("data in state:  ", data); 

    return (
        <div className="mx-[50px] mt-[20px] p-5 rounded-xl bg-slate-900 shadow-5">
            <SimpleGrid cols={{ base: 1, sm: 1, lg: 2 }}>
            <Card  className='flex items-center justify-center' style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg" >
                <SimpleGrid cols={3}>
                    <div className="mt-8">
                        <LeaderBordCard data={data[1]}/>
                    </div>
                    <div className="mb-8">
                        <LeaderBordCard data={data[0]}/>
                    </div>
                    <div className="mt-8">
                        <LeaderBordCard data={data[2]}/>
                    </div>
                </SimpleGrid>
            </Card>
            {/* <div className="flex items-center justify-center"> */}
            <Card className='flex items-center justify-center' style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg">
                <LeaderbordTable data={data}/>
            </Card>
            {/* </div> */}
            </SimpleGrid>
        </div>
    );
}

export default Leaderbord
