import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { RootStateProvider } from './store/RootState.Context';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <ChakraProvider>
      <RootStateProvider>
        <App />
      </RootStateProvider>
    </ChakraProvider>
  </StrictMode>,
);
