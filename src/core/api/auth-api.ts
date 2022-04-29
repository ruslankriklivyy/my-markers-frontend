import { instance } from './axios';
import { removeCookie, setCookie } from '../../utils/cookies';

export const authApi = {
  async signInGoogle(accessToken: string) {
    try {
      const { data } = await instance.post('/auth/google', { accessToken });
      setCookie('refresh_token', data.refresh_token, 30);
      localStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error: any) {
      throw Error(error);
    }
  },

  async login(email: string, password: string) {
    try {
      const { data } = await instance.post('/auth/login', { email, password });
      setCookie('refresh_token', data.refresh_token, 30);
      localStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error: any) {
      throw Error(error);
    }
  },

  async registration(full_name: string, email: string, password: string) {
    try {
      const { data } = await instance.post('/auth/registration', {
        full_name,
        email,
        password,
      });

      setCookie('refresh_token', data.refresh_token, 30);
      localStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error: any) {
      throw Error(error);
    }
  },

  async refresh() {
    try {
      const { data } = await instance.get('/auth/refresh');

      setCookie('refresh_token', data.refresh_token, 30);
      localStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async logout() {
    try {
      const { data } = await instance.post('/auth/logout');

      removeCookie('refresh_token');
      localStorage.removeItem('access_token');
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};
