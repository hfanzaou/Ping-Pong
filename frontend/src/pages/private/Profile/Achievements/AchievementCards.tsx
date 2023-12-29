import React from "react";
import { Card, Group, HoverCard, Image, Text } from "@mantine/core";
import OneAchievementInterface from "./OneAchievementInterface";
import imagge from "./4640282_award_first_medal_place_premium_icon.png"
import firstGameImage from "./4640282_award_first_medal_place_premium_icon.png"
import images from "./AllAchievement.json"

function AchievementCards({type, image, title, name}: OneAchievementInterface) {

    const source = images.find((item) => item.id === image);
    console.log("Type: ", type);
    return (
    <div onTouchMove={() => console.log("test")} className='inline-block w-[100px] h-full mt-4'>
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
                <Image className="blur-sm"
                src={imagge}
                    height={300}
                    alt="Norway"
                    />
                }
            </Card.Section>
            {/* <Text size="xs" ta='center'>
            {name}
            </Text> */}
        </Card>
    </HoverCard.Target>
    <HoverCard.Dropdown>
    <Text size="lg" ta='center'>
            {title}
            </Text>
            </HoverCard.Dropdown>
            </HoverCard>
            </Group>
            </div>
    );
}

export default AchievementCards