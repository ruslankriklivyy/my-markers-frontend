import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Spinner,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import logoIcon from '../assets/icons/logo.png';
import CustomModal from './custom-modal';
import LoginForm from './auth/login-form';
import RegistrationForm from './auth/registration-form';
import User from './user/user';
import { useRootStore } from '../store/root-state.context';
import { observer, Observer } from 'mobx-react-lite';
import { getCookie } from '../utils/cookies';

const Header = observer(() => {
  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = useDisclosure();
  const {
    isOpen: isOpenRegistration,
    onOpen: onOpenRegistration,
    onClose: onCloseRegistration,
  } = useDisclosure();
  const { userStore } = useRootStore();
  const refreshToken = getCookie('refresh_token');
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (refreshToken) {
      userStore.getCurrentUser();
    }
  }, [refreshToken, userStore.isUserLoading]);

  return (
    <Box boxShadow={'md'} p={2}>
      <Container
        maxW={'1000px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box display={'flex'} alignItems={'center'}>
          <Heading as="h2" size="lg" mr={4}>
            React Markers
          </Heading>
          <img className={'logo'} src={logoIcon} alt={'logo'} />
        </Box>
        <Observer>
          {() => (
            <>
              {userStore.isUserLoading ? (
                <Spinner
                  marginRight={20}
                  color={'gray.800'}
                  emptyColor={'gray.300'}
                />
              ) : !userStore.currentUser ? (
                <Box>
                  <Button
                    onClick={onOpenLogin}
                    rightIcon={
                      <svg
                        style={{
                          width: 18,
                          height: 18,
                          transform: 'rotate(180deg)',
                        }}
                        fill={colorMode === 'dark' ? '#fff' : '#000'}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.5,15.1a1,1,0,0,0-1.34.45A8,8,0,1,1,12,4a7.93,7.93,0,0,1,7.16,4.45,1,1,0,0,0,1.8-.9,10,10,0,1,0,0,8.9A1,1,0,0,0,20.5,15.1ZM21,11H11.41l2.3-2.29a1,1,0,1,0-1.42-1.42l-4,4a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l4,4a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L11.41,13H21a1,1,0,0,0,0-2Z" />
                      </svg>
                    }
                    mr={'3'}
                  >
                    Login
                  </Button>
                  <Button onClick={onOpenRegistration}>Registration</Button>
                </Box>
              ) : (
                <User />
              )}
            </>
          )}
        </Observer>
      </Container>
      <CustomModal isOpen={isOpenLogin} onClose={onCloseLogin} title={'Login'}>
        <LoginForm onClose={onCloseLogin} />
      </CustomModal>
      <CustomModal
        isOpen={isOpenRegistration}
        onClose={onCloseRegistration}
        title={'Registration'}
      >
        <RegistrationForm onClose={onCloseRegistration} />
      </CustomModal>
    </Box>
  );
});

export default Header;
