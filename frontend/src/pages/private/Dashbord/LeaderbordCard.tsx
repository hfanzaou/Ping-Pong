import React from 'react';
import { Avatar, Text, Button, Paper } from '@mantine/core';
import leaderboardInterface from './Leaderboard';
// import image from "./test.png";

const image = '';

function LeaderbordCard({data}: {data: leaderboardInterface}) {
  return (
    <Paper radius="md">
      <Avatar
        src={data?.avatar}
        size={120}
        radius={120}
        mx="auto"
      />
      <Text ta="center" fz="lg" fw={500} mt="md">
        {data?.name}
      </Text>
    <Text ta='center' variant="default"  mt="md">
        #{data?.level}
    </Text>
    </Paper>
  );
}
export default LeaderbordCard;




















// import React from 'react';
// import { Avatar, Text, Button, Paper } from '@mantine/core';
// import image from "./test.png";

// function LeaderbordCard() {
//   return (
//     <Paper radius="md"  >
//       <Avatar
//         src={image}
//         size={120}
//         radius={120}
//         mx="auto"
//       />
//       <Text ta="center" fz="lg" fw={500} mt="md">
//         Jane Fingerlicker
//       </Text>
//       <Text ta="center" c="dimmed" fz="sm">
//         Level 2
//       </Text>
//     <Text ta='center' variant="default"  mt="md">
//         #1
//     </Text>
//     </Paper>
//   );
// }
// export default LeaderbordCard;