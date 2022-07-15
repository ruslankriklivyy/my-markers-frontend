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
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { EditIcon } from '@chakra-ui/icons';

import { useRootStore } from '../../store/root-state.context';
import CustomModal from '../custom-modal';
import UserEditForm from './user-edit-form';

import avatarIcon from '../../assets/icons/avatar.svg';

const User = observer(() => {
  const {
    userStore: { currentUser, isFetching, logout },
  } = useRootStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  return (
    <Box display={'flex'} alignItems={'center'}>
      <Popover>
        {/*
        // @ts-ignore */}
        <PopoverTrigger>
          <img
            tabIndex={0}
            className={'avatar'}
            src={currentUser?.avatar?.url || avatarIcon}
            referrerPolicy={'no-referrer'}
            loading={'lazy'}
            alt={'avatar'}
          />
        </PopoverTrigger>

        <PopoverContent>
          {isFetching ? (
            <Spinner
              position={'absolute'}
              top={'50%'}
              left={'50%'}
              color={'gray.800'}
              emptyColor={'gray.300'}
              size={'xl'}
              thickness="3px"
            />
          ) : (
            <>
              <PopoverCloseButton />

              <PopoverBody mt={5}>
                <Box display={'flex'} mb={5}>
                  <Text w={90} fontSize="md" fontWeight={500}>
                    Full name:
                  </Text>

                  <Text fontSize="md">{currentUser?.full_name}</Text>
                </Box>

                <Box display={'flex'} mb={5}>
                  <Text w={90} fontSize="md" fontWeight={500}>
                    Email:
                  </Text>

                  <Text fontSize="md">{currentUser?.email}</Text>
                </Box>

                <Box display={'flex'}>
                  <Text w={90} fontSize="md" fontWeight={500}>
                    Email verified:
                  </Text>

                  <Alert
                    status={currentUser?.is_activated ? 'success' : 'warning'}
                  >
                    <AlertIcon />

                    {currentUser?.is_activated
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
            </>
          )}
        </PopoverContent>
      </Popover>

      <Button onClick={logout} color={'red'} ml={3}>
        Logout
      </Button>

      <CustomModal isOpen={isOpen} onClose={onClose}>
        <UserEditForm onClose={onClose} />
      </CustomModal>
    </Box>
  );
});

export default User;
