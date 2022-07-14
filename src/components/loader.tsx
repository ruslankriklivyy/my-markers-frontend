import React from 'react';
import { Box, Spinner } from '@chakra-ui/react';

export const Loader = () => (
  <Box
    display={'flex'}
    justifyContent={'center'}
    alignItems={'center'}
    position={'absolute'}
    top={0}
    left={0}
    zIndex={400}
    background={`rgba(0, 0, 0, 0.5)`}
    width={'100%'}
    height={'100%'}
  >
    <Spinner
      justifyContent={'center'}
      alignItems={'center'}
      color={'gray.800'}
      emptyColor={'gray.300'}
      size={'xl'}
      thickness={'3px'}
    />
  </Box>
);
