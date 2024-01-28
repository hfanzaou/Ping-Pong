import React, { useEffect, useState } from 'react';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import axios from 'axios';
import MatchHistoryCard from './MatchHistoryCard';
import MatchHistoryInterface from './MatchHistoryInterface';

function  MatchHistory() {
    const [matchsHistory, setMatchsHistory] = useState<MatchHistoryInterface[]>([]);

    const getMatchHistory = async () => {
        await axios.get("user/matchhistory")
        .then((res) => {
            setMatchsHistory(res.data);
        })
        .catch((err) => {
            console.error("error in fetching Matchs History: ", err );
        })
    };

    useEffect(() => {
        getMatchHistory();
    }, []);

    const sliderLeft = () => {
        var slider: any = document.getElementById('match-history-slider');
        slider.scrollLeft = slider.scrollLeft - 400;
    };

    const sliderRight = () => {
        var slider: any = document.getElementById('match-history-slider');
        slider.scrollLeft = slider.scrollLeft + 400;
    };

    const matches = matchsHistory.map((item) => (
        <div key={item.username}>
            <MatchHistoryCard avatar={item.avatar} username={item.username} playerScore={item.playerScore} player2Score={item.player2Score} win={item.win}/>
        </div>
    ));

    return (
        <div className='mx-2 flex flex-col mt-2'>
            <h2 className="mb-5 text-3xl font-medium leading-tight  text-slate-100">Match History</h2>
            <div className='mt-5 relative h-full flex items-center'>
                {matches.length ? <MdChevronLeft className='opacity-50 cursor-pointer hover-opacity-100 color-blue' onClick={sliderLeft} size={40}/>: null}
                <div id='match-history-slider' className='relative flex items-center w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide'>
                    {matches}
                </div>
                {matches.length ?<MdChevronRight className='opacity-50 cursor-pointer hover-opacity-100' onClick={sliderRight} size={40}/> : null}
            </div>
        </div>
    );
}

export default MatchHistory