import React from "react";
import { Card, Image, Text } from "@mantine/core";
import MatchHistoryInterface from "./MatchHistoryInterface";

function MatchHistoryCard({avatar, name, rate, wine}: MatchHistoryInterface) {
    return (
    <div className='inline-block w-[150px] h-full p-2 cursor-pointer hover:scale-110 ease-in-out duration-300'>
        <Card shadow="sm" padding="mg" radius="md" withBorder>
            <Card.Section>
                <Image
                    src={avatar}
                    height={100}
                    alt="Norway"
                />
            </Card.Section>
            <Text size="xs" ta='center'>
                {name}
            </Text>
            <Text ta='center'>
                {rate}
            </Text>
            <Text ta="center" fw={700}>
                {!wine ? "losse" : "wine"}
                {/* {!wine ? <p className="text-red-600">losse</p> : <p className="text-green-600">wine</p>} */}
            </Text>
        </Card>
    </div>
    );
}

export default MatchHistoryCard