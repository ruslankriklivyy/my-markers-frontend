import React, { FC, useState } from 'react';
import { object, string } from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import UploadImage from '../upload-image';
import { useRootStore } from '../../store/root-state.context';

interface FormValues {
  full_name: string;
  avatar: File;
}

interface UserEditFormProps {
  onClose: () => void;
}

const UserEditForm: FC<UserEditFormProps> = ({ onClose }) => {
  const schema = object().shape({
    full_name: string()
      .required('Full name is a required field')
      .max(76, 'Max length of title is 255 symbols'),
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const { userStore } = useRootStore();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    if (!userStore.currentUser) {
      return;
    }

    setIsLoading(true);
    await userStore.update(userStore.currentUser?.id, {
      full_name: data.full_name,
      avatar: data.avatar,
    });
    setIsLoading(false);

    if (!userStore.error) {
      onClose && onClose();
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl mb={3}>
        <FormLabel>Avatar</FormLabel>
        <Controller
          control={control}
          name={'avatar'}
          render={({ field: { value, onChange } }) => {
            return (
              <UploadImage
                defaultValue={userStore.currentUser?.avatar}
                onInput={onChange}
              />
            );
          }}
        />
      </FormControl>
      <FormControl isInvalid={!!errors.full_name?.message} isRequired>
        <FormLabel htmlFor="full_name">Full name</FormLabel>
        <Input
          {...register('full_name')}
          defaultValue={userStore.currentUser?.full_name}
          id="name"
          type="text"
        />
        <FormErrorMessage>{errors.full_name?.message}</FormErrorMessage>
      </FormControl>
      <Box mt={7} mb={5} display={'flex'} justifyContent={'space-between'}>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button
          type={'submit'}
          variant={'solid'}
          colorScheme={'blue'}
          loadingText={'Editing'}
          isLoading={isLoading}
        >
          Edit
        </Button>
      </Box>
    </form>
  );
};

export default UserEditForm;
