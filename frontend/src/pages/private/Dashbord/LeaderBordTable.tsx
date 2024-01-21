import React from "react";
import { Group, Menu, ScrollArea, Table, Avatar, rem, Text, ActionIcon } from "@mantine/core";
// import data from "./test.json";
import leaderboardInterface from "./Leaderboard";


function LeaderbordTable({data}:{data: leaderboardInterface[]}) {
    const rows = data.map((item) => (
      <Table.Tr key={item.username}>
        <Table.Td>
          <Group gap="sm">
            <Avatar size={40} src={item.avatar} radius={40} />
            <div>
              <Text fz="sm" fw={500}>
                {item.username}
              </Text>
              <Text c="dimmed" fz="xs">
                #{item.level}
              </Text>
            </div>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text fz="sm">{item.win}</Text>
          <Text fz="xs" c="dimmed">
            Wins
          </Text>
        </Table.Td>
        <Table.Td>
        <Text fz="sm">{item.loss}</Text>
          <Text fz="xs" c="dimmed">
            Lost
          </Text>
        </Table.Td>
        {/* <Table.Td>
          <Group gap={0} justify="flex-end">
              <Text fz="sm">{item.level}</Text>
              <Text fz="xs" c="dimmed">
                  Level
              </Text>
          </Group>
        </Table.Td> */}
      </Table.Tr>
    ));
  
    return (
        <Table verticalSpacing="md" highlightOnHover withRowBorders={false} horizontalSpacing='xl'>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
  }

  export default LeaderbordTable














// import React from "react";
// import { Group, Menu, ScrollArea, Table, Avatar, rem, Text, ActionIcon } from "@mantine/core";
// import data from "./test.json";


// function LeaderbordTable() {
//     const rows = data.map((item) => (
//       <Table.Tr key={item.name}>
//         <Table.Td c={'cyan'} >
//           <Group gap="sm">
//             <Avatar size={40} src={item.avatar} radius={40} />
//             <div>
//               <Text fz="sm" fw={500}>
//                 {item.name}
//               </Text>
//               <Text c="dimmed" fz="xs">
//                 #{item.rank}
//               </Text>
//             </div>
//           </Group>
//         </Table.Td>
//         <Table.Td>
//           <Text fz="sm">{item.wine}</Text>
//           <Text fz="xs" c="dimmed">
//             Wins
//           </Text>
//         </Table.Td>
//         <Table.Td>
//         <Text fz="sm">{item.lost}</Text>
//           <Text fz="xs" c="dimmed">
//             Lost
//           </Text>
//         </Table.Td>
//         <Table.Td>
//           <Group gap={0} justify="flex-end">
//               <Text fz="sm">{item.level}</Text>
//               <Text fz="xs" c="dimmed">
//                   Level
//               </Text>
//           </Group>
//         </Table.Td>
//       </Table.Tr>
//     ));
  
//     return (
//         <Table verticalSpacing="lg" highlightOnHover withRowBorders={false} horizontalSpacing='xl'>
//           <Table.Tbody>{rows}</Table.Tbody>
//         </Table>
//     );
//   }

//   export default LeaderbordTable