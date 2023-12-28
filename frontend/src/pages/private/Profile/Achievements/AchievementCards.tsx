import React from "react";
import { Card, Group, HoverCard, Image, Text } from "@mantine/core";
import OneAchievementInterface from "./OneAchievementInterface";
import imagge from "./4304494.jpg"

function AchievementCards({type, image, title, name}: OneAchievementInterface) {
    console.log("Type: ", type);
    return (
        <>
        {type  ?
(
    <div onTouchMove={() => console.log("test")} className='inline-block w-[150px] h-full p-2 cursor-pointer hover:scale-110 ease-in-out duration-300'>
            <Group justify="center">
    <HoverCard width={200} openDelay={500}>
    <HoverCard.Target>
    <Card shadow="sm" padding="mg" radius="md" withBorder>
    <Card.Section>
    {type ?
                <Image
                    src={imagge}
                    height={300}
                    alt="Norway"
                    /> :
                <Image
                src={"" + imagge}
                    height={300}
                    alt="Norway"
                    />
                }
            </Card.Section>
            <Text size="xs" ta='center'>
            {name}
            </Text>
        </Card>
    </HoverCard.Target>
    <HoverCard.Dropdown>
    <Text size="lg" ta='center'>
            {title}
            </Text>
            </HoverCard.Dropdown>
            </HoverCard>
            </Group>
            </div>):
            null
        }
        </>
    );
}

export default AchievementCards