import React from "react";
import { Link } from "react-router-dom";
import { Title, Text, Button, Container, Group } from '@mantine/core';

function GoToLogin() {
  return (
    <Container mt='xl'>
    <Text size='xl' bg='red' ta='center' className='rounded-lg'  >404</Text>
    <Title size="lg" ta="center"></Title>
    <Text c="dimmed" size="lg" ta="center">
         Already have an account ?
    </Text>
    <Group justify="center">
      <Button radius='xl' mt={5} color="gray"
      onClick={() => window.location.href = '/login'}
      >
        login
      </Button>
    </Group>
  </Container>
    // <div className="go-to-login">
    //   <p>
    //     Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
    //   </p>
    // </div>
  );
}

export default GoToLogin;