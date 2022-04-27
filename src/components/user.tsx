import React from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { useRootStore } from '../store/root-state.context';
import { observer, Observer } from 'mobx-react-lite';
import avatarIcon from '../assets/icons/avatar.svg';
import { EditIcon } from '@chakra-ui/icons';

const User = observer(() => {
  const { userStore } = useRootStore();

  return (
    <Box display={'flex'} alignItems={'center'}>
      <Popover>
        {/*
        // @ts-ignore */}
        <PopoverTrigger>
          {userStore.currentUser?.avatar ? (
            <img
              tabIndex={0}
              className={'avatar'}
              src={userStore.currentUser.avatar}
              alt={'avatar'}
            />
          ) : (
            <img
              tabIndex={0}
              className={'avatar'}
              src={avatarIcon}
              alt={'avatar'}
            />
          )}
        </PopoverTrigger>
        <PopoverContent>
          <PopoverCloseButton />
          <PopoverBody mt={5}>
            <Box display={'flex'} mb={5}>
              <Text w={90} fontSize="md" fontWeight={500}>
                Full name:
              </Text>
              <Text fontSize="md">{userStore.currentUser?.full_name}</Text>
            </Box>
            <Box display={'flex'} mb={5}>
              <Text w={90} fontSize="md" fontWeight={500}>
                Email:
              </Text>
              <Text fontSize="md">{userStore.currentUser?.email}</Text>
            </Box>
            <Box display={'flex'}>
              <Text w={90} fontSize="md" fontWeight={500}>
                Email verified:
              </Text>
              <Alert
                status={
                  userStore.currentUser?.is_activated ? 'success' : 'warning'
                }
              >
                <AlertIcon />
                {userStore.currentUser?.is_activated
                  ? 'Your email is verified'
                  : 'Your email is not verified'}
              </Alert>
            </Box>
            <Button mt={4} color={'blue.500'} rightIcon={<EditIcon />}>
              Edit profile
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Button onClick={() => userStore.logout()} color={'red'} ml={3}>
        Logout
      </Button>
    </Box>
  );
});

export default User;
