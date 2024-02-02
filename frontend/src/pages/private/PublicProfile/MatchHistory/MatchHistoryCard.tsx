import React from "react";
import { Card, Image, Text } from "@mantine/core";
import MatchHistoryInterface from "./MatchHistoryInterface";


function MatchHistoryCard({avatar, username, playerScore, player2Score, win}: MatchHistoryInterface) {
    return (
        <div className='inline-block w-[130px] h-full p-2'>
            <Card shadow="sm" padding="mg" radius="md" style={{backgroundColor: 'rgb(31 41 55)'}}>
                <Card.Section mb={2} className="h-[15vh]">
                    <img
                        className="object-cover w-full h-full"
                        src={avatar}
                        alt={username}
                    />
                </Card.Section>
                <Text m={2} size="md" fw={500} ta='center' c={'blue'}>
                    {username}
                </Text>
                <Text m={2} ta='center' fw={700} c={win ? 'green' : 'red'}>
                    {playerScore} - {player2Score}
                </Text>
            </Card>
        </div>
    );
}

export default MatchHistoryCard