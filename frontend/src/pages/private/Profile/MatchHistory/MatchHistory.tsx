import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Table, Group, Text, Menu, rem, Image, Card, Container, SimpleGrid } from '@mantine/core';
import { IconMessages, IconTrash} from '@tabler/icons-react';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import {MdChildFriendly} from 'react-icons/md';
import MatchHistoryCard from './MatchHistoryCard';
import data from './test.json'
import MatchHistoryInterface from './MatchHistoryInterface';
import axios from 'axios';

function  MatchHistory() {
    const [matchsHistory, setMatchsHistory] = useState<MatchHistoryInterface[]>([]);


    useEffect(() => {
        const getMatchHistory = async () => {
            await axios.get("user/matchhistory")
            .then((res) => {
                setMatchsHistory(res.data);
                // setMatchsHistory(data);
                // console.log("match history data: ", res.data);
            })
            .catch((err) => {
                console.error("error in fetching Matchs History: ", err );
            })
        };
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
        {/* <div className="flex h-16 w-full items-center rounded-md bg-primary"> */}
            <h2 className="mb-4 text-3xl font-medium leading-tight  text-slate-100">Match History</h2>
        {/* </div> */}
        <div className='relative h-full flex items-center'>
            <MdChevronLeft className='opacity-50 cursor-pointer hover-opacity-100' onClick={sliderLeft} size={40}/>
            <div id='match-history-slider' className='relative flex items-center w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide'>
                {matches}
            </div>
            <MdChevronRight className='opacity-50 cursor-pointer hover-opacity-100' onClick={sliderRight} size={40}/>
        </div>
    </div>
  );
}

export default MatchHistory






// function MatchHistory() {
// const rows = data.map((item) => (
  
//   <Table key={item.name}>
//     <Table.Td>
//       <Group gap="sm">
//         <Menu
//           transitionProps={{ transition: 'pop' }}
//           withArrow
//           position="bottom-end"
//           withinPortal
//           >
//           <Menu.Target>
//            <Avatar size={40} src={item.avatar} radius={40} />
//           </Menu.Target>
//           <Menu.Dropdown>
//             <Menu.Item
//               leftSection={
//                 <IconMessages style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
//               }
//               >
//               Send message
//             </Menu.Item>

//             <Menu.Item
//               leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
//               color="red"
//               >
//               Block friend
//             </Menu.Item>
//           </Menu.Dropdown>
//         </Menu>
//         <div>
//           <Text fz="sm" fw={500}>
//             {item.name}
//           </Text>
//           <Text c="dimmed" fz="xs">
//             {item.rate}
//           </Text>
//         </div>
//       </Group>
//       <Group gap={0}>
//       </Group>
//     </Table.Td>
//   </Table>
// ));
// return (

//   <Table>
//   <Table.Thead>
//     <div className="flex h-16 w-full items-center rounded-md bg-primary p-4">
//       <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">Match History</h2>
//     </div>
//   </Table.Thead>
//   {rows != null ?
//     (<ScrollArea h={250}>
//       <Table.Tbody>
//         {rows}
//       </Table.Tbody>
//     </ScrollArea>) :
//     (<p>add freinds to be more frindly and take an sociale achievements </p>)
//   }
// </Table>
//   );
// }