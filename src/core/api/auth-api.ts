import { instance } from './axios';
import { removeCookie, setCookie } from '../../utils/cookies';

export const authApi = {
  async signInGoogle(accessToken: string) {
    const { data } = await instance.post('/auth/google', { accessToken });

    setCookie('refresh_token', data.refresh_token, 30);
    localStorage.setItem('access_token', data.access_token);

    return data;
  },

  async login(email: string, password: string) {
    const { data } = await instance.post('/auth/login', { email, password });

    setCookie('refresh_token', data.refresh_token, 30);
    localStorage.setItem('access_token', data.access_token);

    return data;
  },

  async registration(full_name: string, email: string, password: string) {
    const { data } = await instance.post('/auth/registration', {
      full_name,
      email,
      password,
    });

    setCookie('refresh_token', data.refresh_token, 30);
    localStorage.setItem('access_token', data.access_token);

    return data;
  },

  async refresh() {
    const { data } = await instance.get('/auth/refresh');

    setCookie('refresh_token', data.refresh_token, 30);
    localStorage.setItem('access_token', data.access_token);
    return data;
  },

  async logout() {
    removeCookie('refresh_token');
    localStorage.removeItem('access_token');

    return await instance.post('/auth/logout');
  },
};
