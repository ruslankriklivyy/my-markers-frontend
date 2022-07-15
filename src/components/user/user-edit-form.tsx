import React, { FC } from 'react';
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
import { observer } from 'mobx-react-lite';

import UploadImage, { UploadImageData } from '../upload-image';
import { useRootStore } from '../../store/root-state.context';

interface FormValues {
  full_name: string;
  avatar: File | UploadImageData;
}

interface UserEditFormProps {
  onClose: () => void;
}

const UserEditForm: FC<UserEditFormProps> = observer(({ onClose }) => {
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

  const {
    userStore: { updateOne, currentUser, isSending },
  } = useRootStore();

  const onSubmit = async (data: FormValues) => {
    if (!currentUser) {
      return;
    }

    await updateOne(currentUser?._id, {
      user: { full_name: data.full_name, avatar: data.avatar },
      oldAvatarId: data.avatar instanceof File ? '' : data.avatar?._id,
    });

    onClose && onClose();
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl mb={3}>
        <FormLabel>Avatar</FormLabel>

        <Controller
          control={control}
          name={'avatar'}
          render={({ field: { onChange } }) => {
            return (
              <UploadImage
                image={currentUser?.avatar}
                onInput={onChange}
                onRemove={() => onChange(null)}
              />
            );
          }}
        />
      </FormControl>

      <FormControl isInvalid={!!errors.full_name?.message} isRequired>
        <FormLabel htmlFor="full_name">Full name</FormLabel>

        <Input
          {...register('full_name')}
          defaultValue={currentUser?.full_name}
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
          isLoading={isSending}
        >
          Edit
        </Button>
      </Box>
    </form>
  );
});

export default UserEditForm;
