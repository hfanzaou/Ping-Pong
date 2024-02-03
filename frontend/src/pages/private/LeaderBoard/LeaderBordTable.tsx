import React from "react";
import { Group, ScrollArea, Table, Avatar, Text, Blockquote} from "@mantine/core";
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
            <Table.Td>
                <Text fz="md" fw={500} c="dimmed">Level</Text>
                <Text fz="sm" c='blue'>{item.level}</Text>
            </Table.Td>
        </Table.Tr>
    ));



    return (
        <div className="flex items-center justify-center">
        {rows.length > 3 ?
            <ScrollArea h='70vh'>
                <Table withRowBorders={false} >
                    <Table.Tbody>
                        {rows}
                    </Table.Tbody>
                </Table>
            </ScrollArea> :
            <Blockquote className='text-xl' ta='center' color="white" c='cyan' radius="lg" mt="xl">
                Other Players List
            </Blockquote>
        }
        </div>
    );
}

export default LeaderbordTable