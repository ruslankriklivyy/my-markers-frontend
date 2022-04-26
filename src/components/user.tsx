import React from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { useRootStore } from '../store/root-state.context';
import { Observer } from 'mobx-react-lite';

const User = () => {
  const { userStore } = useRootStore();

  return (
    <Box display={'flex'} alignItems={'center'}>
      <Observer>
        {() => (
          <>
            <Popover>
              {/*
              // @ts-ignore */}
              <PopoverTrigger>
                <Button>{userStore.currentUser?.full_name}</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverCloseButton />
                <PopoverBody mt={5}>
                  <Box display={'flex'} justifyContent={'space-between'} mb={5}>
                    <Text fontSize="md" fontWeight={500}>
                      Email:
                    </Text>
                    <Text fontSize="md">{userStore.currentUser?.email}</Text>
                  </Box>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Text fontSize="md" fontWeight={500}>
                      Email verified:
                    </Text>
                    <Alert
                      status={
                        userStore.currentUser?.is_activated
                          ? 'success'
                          : 'warning'
                      }
                    >
                      <AlertIcon />
                      {userStore.currentUser?.is_activated
                        ? 'Your email is verified'
                        : 'Your email is not verified'}
                    </Alert>
                  </Box>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Button onClick={() => userStore.logout()} color={'red'} ml={3}>
              Logout
            </Button>
          </>
        )}
      </Observer>
    </Box>
  );
};

export default User;
