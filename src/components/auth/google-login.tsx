import React, { FC } from 'react';
import { Box, Divider, Text } from '@chakra-ui/react';
import GoogleLogin from 'react-google-login';

interface GoogleLoginCompProps {
  responseGoogle: (res: any) => void;
}

const GoogleLoginComp: FC<GoogleLoginCompProps> = ({ responseGoogle }) => {
  return (
    <>
      <Divider />
      <Text mt={7} textAlign={'center'}>
        Or
      </Text>
      <Box mt={4} display={'flex'} justifyContent={'center'}>
        <GoogleLogin
          clientId={process.env.REACT_APP_CLIENT_ID || ''}
          buttonText="Login with google"
          onSuccess={(res) => responseGoogle(res)}
          cookiePolicy={'single_host_origin'}
          className={'btn-login-google'}
        />
      </Box>
    </>
  );
};

export default GoogleLoginComp;
