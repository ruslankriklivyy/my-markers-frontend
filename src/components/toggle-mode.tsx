import React, { useEffect } from 'react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Button, useColorMode } from '@chakra-ui/react';

const ToggleMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (
      localStorage.getItem('chakra-ui-color-mode') === 'light' &&
      colorMode === 'dark'
    ) {
      setTimeout(() => toggleColorMode(), 0);
    } else if (
      localStorage.getItem('chakra-ui-color-mode') === 'dark' &&
      colorMode === 'light'
    ) {
      setTimeout(() => toggleColorMode(), 0);
    }
  }, []);

  return (
    <Button
      onClick={() => toggleColorMode()}
      position={'absolute'}
      top={290}
      right={3}
    >
      {colorMode === 'dark' ? (
        <SunIcon w={6} h={6} color={'yellow.500'} />
      ) : (
        <MoonIcon w={6} h={6} color={'purple.500'} />
      )}
    </Button>
  );
};

export default ToggleMode;
