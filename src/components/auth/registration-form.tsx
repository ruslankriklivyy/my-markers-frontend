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
import { object, string, ref } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRootStore } from '../../store/root-state.context';
import GoogleLoginComp from './google-login';

interface FormValues {
  full_name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

const schema = object()
  .shape({
    full_name: string().required('Full name is a required field').max(255),
    email: string()
      .email()
      .required('Email is a required field')
      .max(255, 'Max length of email is 255 symbols'),
    password: string()
      .matches(
        /^(?=.*\d)(?=.*[A-z])[0-9a-zA-Z0-9!@#$%^&*())()]{8,}$/,
        'Password must consist of Latin letters, numbers and contain at least 8 characters',
      )
      .required('Password is a required field')
      .max(255, 'Max length of password is 255 symbols'),
    passwordRepeat: string()
      .oneOf([ref('password'), null], 'Passwords must match')
      .required('Repeat password is required field'),
  })
  .required();

interface LoginFormProps {
  onClose?: () => void;
}

const RegistrationForm: FC<LoginFormProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const [registrationError, setRegistrationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userStore } = useRootStore();
  const toast = useToast();

  const onSubmit = async (data: FormValues) => {
    const { full_name, email, password } = data;

    setIsLoading(true);
    await userStore.registration(full_name, email, password);

    if (!userStore.currentUser) {
      setRegistrationError('This email is already use');
    }

    toast({
      title: !userStore.error ? 'Account created' : 'Account not created',
      status: userStore.error ? 'error' : 'success',
      duration: 4000,
      isClosable: true,
    });
    setIsLoading(false);

    if (!userStore.error) {
      onClose && onClose();
      reset();
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl mb={3} isInvalid={!!errors.full_name?.message} isRequired>
        <FormLabel htmlFor="full_name">Full name</FormLabel>
        <Input {...register('full_name')} id="full_name" type="text" />
        <FormErrorMessage>{errors.full_name?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mb={3} isInvalid={!!errors.email?.message} isRequired>
        <FormLabel htmlFor="email">Email address</FormLabel>
        <Input {...register('email')} id="email" type="email" />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mb={3} isInvalid={!!errors.password?.message} isRequired>
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input {...register('password')} id="password" type="password" />
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.passwordRepeat?.message} isRequired>
        <FormLabel htmlFor="passwordRepeat">Repeat password</FormLabel>
        <Input
          {...register('passwordRepeat')}
          id="passwordRepeat"
          type="password"
        />
        <FormErrorMessage>{errors.passwordRepeat?.message}</FormErrorMessage>
      </FormControl>
      {registrationError && (
        <p style={{ marginTop: 20, color: 'red' }}>{registrationError}</p>
      )}
      <GoogleLoginComp responseGoogle={responseGoogle} />
      <Box mt={7} mb={5} display={'flex'} justifyContent={'space-between'}>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button
          loadingText="Submitting"
          type={'submit'}
          variant={'solid'}
          colorScheme={'green'}
          isLoading={isLoading}
        >
          Send
        </Button>
      </Box>
    </form>
  );
};

export default RegistrationForm;
