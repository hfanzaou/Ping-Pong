import React from 'react';
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import Login from './Login';

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
} from '@mantine/core';
import axios from 'axios';
// import { GoogleButton } from './GoogleButton';
// import { TwitterButton } from './TwitterButton';

function Authentication(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
//   const [singup, setSingup] = React.useState(false);
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
    type === 'login' ? await axios.post('http://localhost:3001/login/pass', {
        email: form.values.email,
        password: form.values.password,
        })
        .then((res) => {
            if (res.status === 200) {
                console.log("res: ", res);
                // setSingup(true);
            }
        })
        .catch((err) => {
            console.error("err in loging in: ", err);
        }):
    await axios.post('http://localhost:3001/signup/pass', {
        name: form.values.name,
        email: form.values.email,
        password: form.values.password,
        })
        .then((res) => {
            if (res.status === 200) {
                console.log("res: ", res);
                // setSingup(true);
            }
        })
        .catch((err) => {
            console.error("err in sining up: ", err);
        })
  };

  return (
    <div className='h-full ml-[200px] mt-[150px] w-[800px]'>
    <Paper radius="lg" p="xl" withBorder {...props}>
      {/* <Text size="lg" fw={500}>
        Welcome to Mantine, {type} with
      </Text> */}

      {/* <Group grow mb="md" mt="md"> */}
        {/* <Login/> */}

        {/* <GoogleButton radius="xl">Google</GoogleButton> */}
        {/* <TwitterButton radius="xl">Twitter</TwitterButton> */}
      {/* </Group> */}

      {/* <Divider label="Or continue with email" labelPosition="center" my="lg" /> */}

      <form onSubmit={form.onSubmit(() => {handelSubmit})}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius="md"
            />
            )}
          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
            />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
            />
{/* 
          {type === 'register' && (
              <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
              )} */}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <div>

            <Login/>
          <Button onClick={handelSubmit} color='gray' type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
          </div>
        </Group>
      </form>
    </Paper>
              </div>
  );
}

export default Authentication;