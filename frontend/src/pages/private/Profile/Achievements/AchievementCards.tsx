import React from "react";
import { Card, Group, HoverCard, Image, Text } from "@mantine/core";
import OneAchievementInterface from "./OneAchievementInterface";
import firstGameImage from "./assite/firstGame.png"
import firstFriendImage from "./assite/firstFriend.png"
import lead1Image from "./assite/lead1.png"
import lead2Image from "./assite/lead2.png"
import lead3Image from "./assite/lead3.png"


function AchievementCards({type, image, title, name}: OneAchievementInterface) {

    if (name === "firstMatch") {
        image = firstGameImage;
    } else if (name === "firstFriend") {
        image = firstFriendImage;
    } 
    else if (name === "lead1") {
        image = lead1Image;
    } else if (name === "lead2") {
        image = lead2Image;
    } else if (name === "lead3") {
        image = lead3Image;
    }

    return (
        <div className='w-[100px] '>
            <Group justify="center">
                <HoverCard radius='md' width={100} openDelay={300} closeDelay={200} offset={-5}>
                    <HoverCard.Target>
                        <Card shadow="sm" radius="md" withBorder>
                            <Card.Section>
                                {type ?
                                <Image
                                    src={image}
                                    alt={title}
                                /> :
                                <Image className="blur-sm"
                                src={image}
                                    alt={title}
                                />
                                }
                            </Card.Section>
                        </Card>
                    </HoverCard.Target>
                    <HoverCard.Dropdown bg='dark'>
                        <Text c='cyan' size="lg" ta='center'>{title}</Text>
                    </HoverCard.Dropdown>
                </HoverCard>
            </Group>
        </div>
    );
}

export default AchievementCards