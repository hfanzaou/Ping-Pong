import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import ChatApp from './Chat/ChatApp';


function App() {
  return (
    <MantineProvider>
      <ChatApp />
    </MantineProvider>
  )
}

export default App
