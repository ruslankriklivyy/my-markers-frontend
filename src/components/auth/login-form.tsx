import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRootStore } from '../../store/root-state.context';
import { Observer } from 'mobx-react-lite';
import GoogleLoginComp from './google-login';

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
  const toast = useToast();
  const { userStore } = useRootStore();

  const onSubmit = async (data: FormValues) => {
    const { email, password } = data;

    setIsLoading(true);
    await userStore.login(email, password);

    if (!userStore.currentUser) {
      setLoginError('Incorrect password or email');
    }

    toast({
      title: userStore.error ? 'You was not logged' : 'You was logged',
      status: userStore.error ? 'error' : 'success',
      duration: 4000,
      isClosable: true,
    });
    setIsLoading(false);

    if (!userStore.error) {
      reset();
      onClose && onClose();
      document.location.reload();
    }
  };

  const responseGoogle = async (res: any) => {
    setIsLoading(true);
    await userStore.signInGoogle(res.tokenId);

    toast({
      title: userStore.error ? 'You was not logged' : 'You was logged',
      status: userStore.error ? 'error' : 'success',
      duration: 4000,
      isClosable: true,
    });
    setIsLoading(false);

    if (!userStore.error) {
      onClose && onClose();
      reset();
    }
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
          <FormControl mb={7} isInvalid={!!errors.password?.message} isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input {...register('password')} id="password" type="password" />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
          {loginError && (
            <p style={{ marginTop: 20, color: 'red' }}>{loginError}</p>
          )}
          <GoogleLoginComp responseGoogle={responseGoogle} />
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
