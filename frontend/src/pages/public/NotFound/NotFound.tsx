import React from 'react';
import { Title, Text, Button, Container, Group } from '@mantine/core';

export function NotFoundTitle() {
  return (
    <Container mt='xl'>
      <Text size='xl' bg='red' ta='center' className='rounded-lg'  >404</Text>
      <Title >You have found a secret place.</Title>
      <Text c="dimmed" size="lg" ta="center">
        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
        been moved to another URL.
      </Text>
      <Group justify="center">
        <Button radius='xl' color="gray"
        onClick={() => window.location.href = '/'}
        >
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}

export default NotFoundTitle;