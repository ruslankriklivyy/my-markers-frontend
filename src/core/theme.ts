import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: localStorage.getItem('chakra-ui-color-mode') as any,
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

export default theme;
