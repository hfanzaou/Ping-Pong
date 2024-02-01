import React from 'react';
import { Title, Text, Button, Group, Card } from '@mantine/core';

export function NotFoundTitle() {
    return (
        <div className='flex justify-center m-[50px] p-5 rounded-xl bg-slate-900 shadow-5 h-[70vh]'>
            <Card
                className='flex flex-col justify-center space-y-5 h-full w-full'
                style={{backgroundColor: 'rgb(31 41 55)'}}
            >
                <Title ta='center' c='blue'>Not Found</Title>
                <Text size='xl' bg='red' ta='center' className='rounded-lg'  >404</Text>
                <Text c="dimmed" size="lg" ta="center">
                    Unfortunately, this is only a 404 page. You may have mistyped the address, or the page not exist
                </Text>
                <Group justify="center">
                    <Button size='xs' radius='xl' color="blue" variant="outline"
                        onClick={() => window.location.href = '/'}
                    >
                        Take me back to home page
                    </Button>
                </Group>
            </Card>
        </div>
    );
}

export default NotFoundTitle;