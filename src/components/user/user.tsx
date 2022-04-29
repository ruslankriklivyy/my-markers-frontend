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
  useDisclosure,
} from '@chakra-ui/react';
import { useRootStore } from '../../store/root-state.context';
import { observer } from 'mobx-react-lite';
import avatarIcon from '../../assets/icons/avatar.svg';
import { EditIcon } from '@chakra-ui/icons';
import CustomModal from '../custom-modal';
import UserEditForm from './user-edit-form';

const User = observer(() => {
  const { userStore } = useRootStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box display={'flex'} alignItems={'center'}>
      <Popover>
        {/*
        // @ts-ignore */}
        <PopoverTrigger>
          {userStore.currentUser?.avatar?.url ? (
            <img
              tabIndex={0}
              className={'avatar'}
              src={userStore.currentUser.avatar.url}
              loading="lazy"
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
            <Button
              onClick={onOpen}
              mt={4}
              color={'blue.500'}
              rightIcon={<EditIcon />}
            >
              Edit profile
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Button onClick={() => userStore.logout()} color={'red'} ml={3}>
        Logout
      </Button>
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <UserEditForm onClose={onClose} />
      </CustomModal>
    </Box>
  );
});

export default User;
