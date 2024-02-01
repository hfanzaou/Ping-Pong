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
        // 425 is the height of the table
        <ScrollArea h='70vh'>
            <Table withRowBorders={false} >
                <Table.Tbody>
                    {rows}
                </Table.Tbody>
            </Table>
        </ScrollArea>
    );
}

export default LeaderbordTable