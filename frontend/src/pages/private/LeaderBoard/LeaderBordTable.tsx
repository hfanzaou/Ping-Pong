import React from "react";
import { Group, ScrollArea, Table, Avatar, Text} from "@mantine/core";
import leaderboardInterface from "./Leaderboard";

function LeaderbordTable({data}:{data: leaderboardInterface[]}) {

    const rows = data.map((item, index) => (
        index > 2 &&
        <Table.Tr key={item.name}>
            <Table.Td>
                <Group gap="sm" className="mr-8">
                    <Avatar size={40} src={item.avatar} radius={40} />
                    <div>
                        <Text fz="md" fw={800} c='indigo'>{item.name}</Text>
<<<<<<< HEAD
                        {/* <Text fz="sm" fw={500}>{item.name}</Text> */}
=======
>>>>>>> master
                        <Text c="dimmed" fz="xs">#{index + 1}</Text>
                    </div>
                </Group>
            </Table.Td>
            {/* <Table.Td>
                <Text fz="sm">{item.win}</Text>
                <Text fz="xs" c="dimmed">Wins</Text>
            </Table.Td>
            <Table.Td>
                <Text fz="sm">{item.loss}</Text>
                <Text fz="xs" c="dimmed">Lost</Text>
            </Table.Td> */}
            <Table.Td>
                <Text fz="md" fw={500} c="dimmed">Level</Text>
                <Text fz="sm" c='blue'>{item.level}</Text>
            </Table.Td>
        </Table.Tr>
    ));

    return (
<<<<<<< HEAD
        <ScrollArea h={425}>
            <Table  withRowBorders={false} className='h-full w-full'>
                <Table.Tbody>{rows}</Table.Tbody>
=======
        // 425 is the height of the table
        <ScrollArea h={425}>
            <Table  withRowBorders={false} className='h-full w-full'>
                <Table.Tbody>
                    {rows}
                    {rows}
                    {rows}
                    {rows}
                    {rows}
                    {rows}

                </Table.Tbody>
>>>>>>> master
            </Table>
        </ScrollArea>
    );
}

export default LeaderbordTable