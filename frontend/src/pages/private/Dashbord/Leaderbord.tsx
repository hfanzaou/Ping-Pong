import React from "react";
import Header from "../../../Layout/Header/Header";
import { Group, Menu, ScrollArea, Table, Avatar, rem, Text, ActionIcon } from "@mantine/core";
import data from "./test.json";
import LeaderbordCard from "./LeaderbordCard";

import {
  IconPencil,
  IconMessages,
  IconNote,
  IconReportAnalytics,
  IconTrash,
  IconDots,
} from '@tabler/icons-react';


export function LeaderbordTable() {
  const rows = data.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={40} src={item.avatar} radius={40} />
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            <Text c="dimmed" fz="xs">
              #{item.rank}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.wine}</Text>
        <Text fz="xs" c="dimmed">
          Wins
        </Text>
      </Table.Td>
      <Table.Td>
      <Text fz="sm">{item.lost}</Text>
        <Text fz="xs" c="dimmed">
          Lost
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
            <Text fz="sm">{item.level}</Text>
            <Text fz="xs" c="dimmed">
                Level
            </Text>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
      <Table verticalSpacing="md" highlightOnHover withRowBorders={false} horizontalSpacing='xl'>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
  );
}

// const LeaderbordCard = () => {
//     return (
//         <div className="bg-neutral-700 h-15">

//         </div>
//     );
// };

function Leaderbord({setAvatar, avatar} : {setAvatar: Function, avatar: string}) {
    return (
        <div className="bg-[url('./4304494.jpg')]  h-full items-cente">
            {/* <Header/> */}
            <Header setAvatar={setAvatar} avatar={avatar}/>
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
        </div>
    );
}

export default Leaderbord