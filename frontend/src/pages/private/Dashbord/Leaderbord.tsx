import React from "react";
import Header from "../../../Layout/Header/Header";
import Footer from '../../../Layout/Footer/Footer';
import LeaderbordCard from "./LeaderBordCard";
import LeaderbordTable from "./LeaderBordTable";

import {
  IconPencil,
  IconMessages,
  IconNote,
  IconReportAnalytics,
  IconTrash,
  IconDots,
} from '@tabler/icons-react';


function Leaderbord({avatar} : {avatar: string}) {
    return (
        // <div className="bg-[url('./4304494.jpg')] h-full items-cente">
        <div className="h-full items-center">

            <Header avatar={avatar}/>
            <div className="flex  space-x-8  items-center justify-center mt-8">
                <LeaderbordCard />
                    <LeaderbordCard />
                <LeaderbordCard />
            </div>
            <div className="flex items-center justify-center">
            <div className="mt-8 pt-8 w-[700px]"  >
                <LeaderbordTable/>
            </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Leaderbord