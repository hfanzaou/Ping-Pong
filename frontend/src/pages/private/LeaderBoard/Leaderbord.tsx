import React, { useEffect, useState } from "react";
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
            // console.log("res.data: ", res.data);
        }).catch((err) => {
            console.log("error in fetching leadrbord data: ", err);
        })
    };
    
    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="mx-[50px] mt-[20px] p-5 rounded-xl bg-slate-900 shadow-5">
            <SimpleGrid cols={{ base: 1, sm: 1, lg: 2 }}>
                <Card  className='flex items-center justify-center' style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg" >
                    <SimpleGrid cols={3}>
                        <div className="mt-8">
                            <LeaderBordCard data={data[1]} rank={2}/>
                        </div>
                        <div className="mb-8">
                            <LeaderBordCard data={data[0]} rank={1}/>
                        </div>
                        <div className="mt-8">
                            <LeaderBordCard data={data[2]} rank={3}/>
                        </div>
                    </SimpleGrid>
                </Card>
                <Card className='flex items-center justify-center' style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg">
                    <LeaderbordTable data={data}/>
                </Card>
            </SimpleGrid>
        </div>
    );
}

export default Leaderbord
