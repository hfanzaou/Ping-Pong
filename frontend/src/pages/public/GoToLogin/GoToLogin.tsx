import React from "react";
import { Title, Text, Button, Container, Group } from '@mantine/core';

function GoToLogin() {
    return (
        <div className='sticky top-0 z-50 p-2'>
            <div className='mx-[50px] mt-5 p-5 rounded-xl bg-slate-900 shadow-5'>
                <Container h={450} mt='xl' className="flex flex-col items-center justify-center rounded-md p-5" style={{backgroundColor: 'rgb(31 41 55)'}}>
                    <Title size="lg" ta="center" c={'blue'} >Already have an account ?</Title>
                    <Group justify="center">
                        <Button size="xs" radius='xl' mt={5} color="gray"
                            onClick={() => window.location.href = '/login'}
                        >
                            <Text size="xl" ta="center">
                                login
                            </Text>
                        </Button>
                    </Group>
                </Container>
            </div>
        </div>
    );
}

export default GoToLogin;