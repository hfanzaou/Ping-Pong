import React from 'react';
import { Title, Text, Button, Container, Group } from '@mantine/core';

export function NotFoundTitle() {
    return (
        <div className='flex justify-center mx-[50px] h-[497px] mt-5 p-5 rounded-xl bg-slate-900 shadow-5'>
            <Container mt='xl' className='flex flex-col justify-center space-y-5'>
                <Title ta='center' c='blue'>Not Found</Title>
                <Text size='xl' bg='red' ta='center' className='rounded-lg'  >404</Text>
                <Text c="dimmed" size="lg" ta="center">
                    Unfortunately, this is only a 404 page. You may have mistyped the address, or the page not exist
                </Text>
                <Group justify="center">
                    <Button size='xs' radius='xl' color="gray"
                        onClick={() => window.location.href = '/'}
                    >
                        Take me back to home page
                    </Button>
                </Group>
            </Container>
        </div>
    );
}

export default NotFoundTitle;