import React from "react";
import { Card, Image, Text } from "@mantine/core";
import MatchHistoryInterface from "./MatchHistoryInterface";

function MatchHistoryCard({avatar, username, playerScore, player2Score, win}: MatchHistoryInterface) {
    return (
    <div className='inline-block w-[150px] h-full p-2 cursor-pointer hover:scale-110 ease-in-out duration-300'>
        <Card shadow="sm" padding="mg" radius="md" withBorder>
            <Card.Section>
                <Image
                    h={100}
                    src={avatar}
                    alt="Norway"
                    />
            </Card.Section>
            <Text size="xs" ta='center'>
                {username}
            </Text>
            <Text ta='center'>
                {playerScore} - {player2Score}
            </Text>
            <Text ta="center" fw={500}>
                {!win ? "loss" : "win"}
                {/* {!wine ? <p className="text-red-600">losse</p> : <p className="text-green-600">wine</p>} */}
            </Text>
        </Card>
    </div>
    );
}



export default MatchHistoryCard