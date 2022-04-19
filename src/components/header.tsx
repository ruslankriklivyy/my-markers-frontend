import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import loginIcon from '../assets/icons/login.svg';
import CustomModal from './custom-modal';
import LoginForm from './auth/login-form';
import RegistrationForm from './auth/registration-form';
import User from './user';
import { useRootStore } from '../store/RootState.Context';
import { Observer } from 'mobx-react-lite';

const Header = () => {
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

  useEffect(() => {
    userStore.getCurrentUser();
  }, []);

  return (
    <Box bg={'#fff'} color={'black'} boxShadow={'md'} p={2}>
      <Container
        maxW={'1000px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Heading as="h2" size="lg">
          React Markers
        </Heading>
        <Observer>
          {() =>
            !userStore.currentUser ? (
              <Box>
                <Button
                  onClick={onOpenLogin}
                  rightIcon={
                    <img
                      src={loginIcon}
                      width={20}
                      height={20}
                      style={{ transform: 'rotate(180deg)' }}
                      alt={'login'}
                    />
                  }
                  mr={'3'}
                  color={'black'}
                >
                  Login
                </Button>
                <Button onClick={onOpenRegistration} color={'black'}>
                  Registration
                </Button>
              </Box>
            ) : (
              <User />
            )
          }
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
};

export default Header;
