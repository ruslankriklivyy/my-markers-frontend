import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRootStore } from '../../store/RootState.Context';
import { Observer } from 'mobx-react-lite';

interface FormValues {
  email: string;
  password: string;
}

const schema = object()
  .shape({
    email: string()
      .email()
      .required('Email is a required field')
      .max(255, 'Max length of email is 255 symbols'),
    password: string()
      .required('Password is a required field')
      .max(255, 'Max length of password is 255 symbols'),
  })
  .required();

interface LoginFormProps {
  onClose?: () => void;
}

const LoginForm: FC<LoginFormProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userStore } = useRootStore();

  const onSubmit = async (data: FormValues) => {
    const { email, password } = data;

    setIsLoading(true);
    await userStore.login(email, password);

    if (!userStore.currentUser) {
      return setLoginError('Incorrect password or email');
    }

    onClose && onClose();
    reset();
    setIsLoading(false);
  };

  return (
    <Observer>
      {() => (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={3} isInvalid={!!errors.email?.message} isRequired>
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input {...register('email')} id="email" type="email" />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password?.message} isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input {...register('password')} id="password" type="password" />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
          {loginError && (
            <p style={{ marginTop: 20, color: 'red' }}>{loginError}</p>
          )}
          <Box mt={7} mb={5} display={'flex'} justifyContent={'space-between'}>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button
              type={'submit'}
              variant={'solid'}
              colorScheme={'green'}
              loadingText="Submitting"
              isLoading={isLoading}
            >
              Send
            </Button>
          </Box>
        </form>
      )}
    </Observer>
  );
};

export default LoginForm;
