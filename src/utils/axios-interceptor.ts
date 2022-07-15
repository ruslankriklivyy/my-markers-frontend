import axios, { AxiosInstance } from 'axios';

import { authApi } from '../core/api/auth-api';

axios.defaults.withCredentials = true;

const commonInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

const fileInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'Content-Type': 'multipart/form-data;',
  },
});

const createInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        const { access_token } = await authApi.refresh();
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + access_token;

        return instance(originalRequest);
      }

      return Promise.reject(error);
    },
  );
};

createInterceptor(commonInstance);
createInterceptor(fileInstance);

export const instances = {
  commonInstance,
  fileInstance,
};
