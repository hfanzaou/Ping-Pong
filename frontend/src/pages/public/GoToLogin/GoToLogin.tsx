import React from "react";
import { Title, Text, Button, Group, Card } from '@mantine/core';

function GoToLogin() {
    return (
        <>
            <div className="h-[2vh]"></div>
            <div className='m-[50px] p-5 rounded-xl bg-slate-900 shadow-5 h-[80vh]'>
                <Card className="flex flex-col items-center justify-center space-y-5  rounded-md p-5 h-full w-full" style={{backgroundColor: 'rgb(31 41 55)'}}>
                    <Title size="lg" ta="center" c='lime' >Already have an account ?</Title>
                    <Group justify="center">
                        <Button size="xs" radius='xl' mt={5} color="blue" variant="outline"
                            onClick={() => window.location.href = '/login'}
                            >
                            <Text size="xl" ta="center">
                                login
                            </Text>
                        </Button>
                    </Group>
                </Card>
            </div>
        </>
    );
}

export default GoToLogin;