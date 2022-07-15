import React, { useEffect, useCallback, ReactNode } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from '@chakra-ui/react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  const [error, setError] = React.useState('');

  const promiseRejectionHandler = useCallback(
    (event: PromiseRejectionEvent) => {
      setError(event.reason);
    },
    [],
  );

  const resetError = useCallback(() => {
    setError('');
    document.location.reload();
  }, []);

  useEffect(() => {
    window.addEventListener('unhandledrejection', promiseRejectionHandler);

    return () => {
      window.removeEventListener('unhandledrejection', promiseRejectionHandler);
    };
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return error ? (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="100vh"
    >
      <AlertIcon boxSize="120px" mr={0} />

      <AlertTitle mt={4} mb={1} fontSize="x-large">
        Something went wrong
      </AlertTitle>

      <AlertDescription maxWidth="sm" mt={3}>
        {error.toString()}
      </AlertDescription>

      <Button
        mt={4}
        w={200}
        h={10}
        type={'button'}
        variant={'solid'}
        colorScheme={'blackAlpha'}
        onClick={resetError}
      >
        Back
      </Button>
    </Alert>
  ) : (
    <>{children}</>
  );
};
