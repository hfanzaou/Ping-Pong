import React from 'react';
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import Login from './Login';
import image from "./home.jpg"
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  SimpleGrid,
} from '@mantine/core';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import { GoogleButton } from './GoogleButton';
// import { TwitterButton } from './TwitterButton';

function Authentication(props: PaperProps) {
    const [incorect, setIncorect] = React.useState(false);
  const [type, toggle] = useToggle(['login', 'register']);

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const handelSubmit = async () => {
        console.log("handelSubmit");
        console.log("form.values: ", form.values);
        type === 'login' ? await axios.post('login/pass', {
        email: form.values.email,
        password: form.values.password,
        })
        .then((res) => {
            if (res.status === 201) {
                console.log("res: ", res);
                if(res.data.twofa === true)
                    window.location.href = `${import.meta.env.VITE_APP_URL}auth`;
                else
                    window.location.href = `${import.meta.env.VITE_APP_URL}`;
            }

        })
        .catch((err) => {
            setIncorect(true);
            console.error("err in loging in: ", err);
        }):
    await axios.post('signup/pass', {
        name: form.values.name,
        email: form.values.email,
        password: form.values.password,
        })
        .then((res) => {
            if (res.status === 201) {
                console.log("res: ", res);
                window.location.href = `${import.meta.env.VITE_APP_URL}Setting`;
            }
        })
        .catch((err) => {
            setIncorect(true);
            console.error("err in sining up: ", err);
        })
    };

    return (
        <div>

        <div className='sticky top-0 z-50'>

        </div>
        <div className='mx-[50px] my-5 p-5 rounded-xl bg-slate-900 shadow-5'>
            <SimpleGrid
                className='grid place-items-center'
                cols={{base: 1, md:2, lg: 2, xl: 2}}
                spacing='sm'
            >
                <Paper h={520} c='blue' bg={'rgb(31 41 55)'} radius="lg" p="md" {...props}>
                <Text size="md" fw={500}>
                    Welcome to game
                </Text>
                <Group grow mb="md" mt="md">
                    <Login/>
                </Group>
                <Divider label="Or continue with email" labelPosition="center" my="lg" />
                        {incorect && <Text c={'red'}>Incorrect, try agin</Text>}
                <form onSubmit={form.onSubmit(() => {handelSubmit})}>
                    <Stack>
                        {type === 'register' && (
                        <TextInput
                            radius="md"
                            variant="filled"
                            required
                            label="Name"
                            placeholder="Your name"
                            value={form.values.name}
                            onChange={(event) => {
                                    form.setFieldValue('name', event.currentTarget.value);
                                    setIncorect(false)
                                }
                            }
                        />
                        )}
                        <TextInput
                            radius="md"
                            variant="filled"
                            required
                            label="Email"
                            placeholder="Your email"
                            value={form.values.email}
                            error={form.errors.email && 'Invalid email'}
                            onChange={(event) => {
                                form.setFieldValue('email', event.currentTarget.value);
                                    setIncorect(false);
                                }
                            }
                            />
                            <PasswordInput
                                radius="md"
                                variant="filled"
                                required
                                label="Password"
                                placeholder="Your password"
                                value={form.values.password}
                                error={form.errors.password && 'Password should include at least 6 characters'}
                                onChange={(event) =>  {
                                        form.setFieldValue('password', event.currentTarget.value);
                                        setIncorect(false);
                                    }
                                }
                            />
                        </Stack>
                        <Group justify="space-between" mt="md">
                            <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
                                {type === 'register'
                                ? 'Already have an account? Login'
                                : "Don't have an account? Register"}
                            </Anchor>
                            <div>
                                <Button onClick={handelSubmit} color='green' size='xs' type="submit" radius="xl">
                                    {upperFirst(type)}
                                </Button>
                            </div>
                        </Group>
                    </form>
                </Paper>
                <img className='rounded-lg' src={image} alt="ping pong image" />
            </SimpleGrid>
        </div>
                            </div>
    );
}

export default Authentication;