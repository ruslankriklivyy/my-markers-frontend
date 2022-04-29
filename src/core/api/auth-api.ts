import { instance } from './axios';
import axios from 'axios';
import { removeCookie, setCookie } from '../../utils/cookies';

export const authApi = {
  async signInGoogle(accessToken: string) {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_API_URL + '/auth/google',
        { accessToken },
        { withCredentials: true },
      );
      // setCookie('refresh_token', data.refresh_token, 30);
      localStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error: any) {
      throw Error(error);
    }
  },

  async login(email: string, password: string) {
    try {
      const { data } = await instance.post(
        '/auth/login',
        { email, password },
        { withCredentials: true },
      );
      // setCookie('refresh_token', data.refresh_token, 30);
      localStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error: any) {
      throw Error(error);
    }
  },

  async registration(full_name: string, email: string, password: string) {
    try {
      const { data } = await instance.post(
        '/auth/registration',
        {
          full_name,
          email,
          password,
        },
        { withCredentials: true },
      );

      // setCookie('refresh_token', data.refresh_token, 30);
      localStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error: any) {
      throw Error(error);
    }
  },

  async refresh() {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_URL + '/auth/refresh',
        {
          withCredentials: true,
        },
      );

      // setCookie('refresh_token', data.refresh_token, 30);
      localStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async logout() {
    try {
      const { data } = await instance.post('/auth/logout');

      // removeCookie('refresh_token');
      localStorage.removeItem('access_token');
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};
