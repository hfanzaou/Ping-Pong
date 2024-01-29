import React from "react";
import { Group, ScrollArea, Table, Avatar, Text} from "@mantine/core";
import leaderboardInterface from "./Leaderboard";

function LeaderbordTable({data}:{data: leaderboardInterface[]}) {

    const rows = data.map((item, index) => (
        index > 2 &&
        <Table.Tr key={item.name}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar size={40} src={item.avatar} radius={40} />
                    <div>
                        <Text fz="sm" fw={500}>{item.name}</Text>
                        <Text c="dimmed" fz="xs">#{index + 1}</Text>
                    </div>
                </Group>
            </Table.Td>
            <Table.Td>
                <Text fz="sm">{item.win}</Text>
                <Text fz="xs" c="dimmed">Wins</Text>
            </Table.Td>
            <Table.Td>
                <Text fz="sm">{item.loss}</Text>
                <Text fz="xs" c="dimmed">Lost</Text>
            </Table.Td>
            <Table.Td>
                <Text fz="sm">{item.level}</Text>
                <Text fz="xs" c="dimmed">Level</Text>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table  withRowBorders={false} className='h-full w-full'>
            <ScrollArea h={425}>
                <Table.Tbody>{rows}</Table.Tbody>
            </ScrollArea>
        </Table>
    );
}

export default LeaderbordTable