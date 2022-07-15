import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import { RootStateProvider } from './store/root-state.context';
import './index.css';
import App from './App';
import theme from './core/theme';
import { ErrorBoundary } from './components/error-boundary';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <ChakraProvider>
      <RootStateProvider>
        <ErrorBoundary>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ErrorBoundary>
      </RootStateProvider>
    </ChakraProvider>
  </StrictMode>,
);
