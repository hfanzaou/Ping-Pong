import React, { useEffect, useState } from "react";
import LeaderBordCard from "./LeaderBordCard";
import LeaderbordTable from "./LeaderBordTable";
import axios from "axios";
import leaderboardInterface from "./Leaderboard";
import { Blockquote, Card, SimpleGrid } from "@mantine/core";

function Leaderbord({avatar} : {avatar: string}) {
    const [data, setData] = useState<leaderboardInterface[]>([]);

    const getData = async () => {
        await axios.get('user/leaderboard')
        .then((res) => {
            setData(res.data);
            // console.log("res.data: ", res.data);
        }).catch((err) => {
            if (err.response.status === 401) {
                window.location.replace('/login');
            }
            console.log("error in fetching leadrbord data: ", err);
        })
    };
    
    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="mx-[50px] mt-[20px] p-5 rounded-xl bg-slate-900 shadow-5 xl:h-[75vh]">
            <SimpleGrid m={0} p={0} cols={{ base: 1, sm: 1, lg: 2 }}>
                <Card p={2} className='flex items-center justify-center' style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg" >
                    <SimpleGrid m={15} cols={3}>
                        <div className="mt-8">
                            {data[1] ? <LeaderBordCard data={data[1]} rank={2}/> :
                                <Card  p={0} radius="md" bg='dark' className='flex flex-col space-y-4 h-full w-full'>
                                <div className="flex items-center justify-center">
                                    <Blockquote className="self-center text-xl" ta='center' color="white" c='cyan' radius="lg" mt="xl">
                                        Lead 2
                                    </Blockquote>
                                </div>
                                </Card>
                            }
                        </div>
                        <div className="mb-8">
                            {data[0] ? <LeaderBordCard data={data[0]} rank={1}/> :
                                <Card  p={0} radius="md" bg='dark' className='flex flex-col space-y-4 h-full w-full'>
                                <div className="flex items-center justify-center">
                                    <Blockquote className="self-center text-xl" ta='center' color="white" c='cyan' radius="lg" mt="xl">
                                        Lead 1
                                    </Blockquote>
                                </div>
                                </Card>
                            }
                        </div>
                        <div className="mt-8">
                            {data[2] ? <LeaderBordCard data={data[2]} rank={3}/> : 
                                <Card  p={0} radius="md" bg='dark' className='flex flex-col space-y-4 h-full w-full'>
                                <div className="flex items-center justify-center">
                                    <Blockquote className="self-center text-xl" ta='center' color="white" c='cyan' radius="lg" mt="xl">
                                        Lead 3
                                    </Blockquote>
                                </div>
                                </Card>
                            }
                        </div>
                    </SimpleGrid>
                </Card>
                <Card p={2} className='flex items-center justify-center' style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg">
                    <LeaderbordTable data={data}/>
                </Card>
            </SimpleGrid>
        </div>
    );
}

export default Leaderbord
