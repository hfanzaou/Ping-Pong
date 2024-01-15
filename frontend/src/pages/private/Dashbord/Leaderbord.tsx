import React from "react";
import Header from "../../../Layout/Header/Header";
import Footer from '../../../Layout/Footer/Footer';
import LeaderbordTable from "./LeaderBordTable";
import LeaderbordCard from "./LeaderbordCard";
import { Card, ScrollArea, SimpleGrid } from "@mantine/core";

function Leaderbord({avatar} : {avatar: string}) {
    return (
        <div className='mx-[50px] mt-5 p-5 rounded-xl bg-slate-900 shadow-5'>
            <SimpleGrid 
                cols={{base: 1, md: 1, lg: 2, xl: 2, xxl: 2}}
                spacing='md'
            >
                <Card 
                    style={{backgroundColor: 'rgb(31 41 55)'}} 
                    radius="lg"
                >
            <div className="flex  space-x-8  items-center justify-center">
                    <LeaderbordCard />
                        {/* <LeaderbordCard />
                    <LeaderbordCard /> */}
            </div>
                </Card>
            <Card  style={{backgroundColor: 'rgb(31 41 55)'}} radius="lg">

            <div className="flex items-center justify-center">
            {/* <div className="mt-8 pt-8 w-[700px]"> */}
            <ScrollArea h={425}>
                <LeaderbordTable/>
            </ScrollArea>
        
            {/* </div> */}
            </div>
            </Card>
            </SimpleGrid>
        </div>
    );
}

export default Leaderbord