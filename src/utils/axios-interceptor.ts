import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { authApi } from '../core/api/auth-api';

axios.defaults.withCredentials = true;

const instances = {
  commonInstance: axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  }),

  fileInstance: axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'multipart/form-data;',
    },
  }),
};

const refreshAuth = () =>
  authApi
    .refresh()
    .then(() => Promise.resolve())
    .catch((err) => console.log(err));

Object.values(instances).forEach((instance) =>
  createAuthRefreshInterceptor(instance, refreshAuth, { statusCodes: [401] }),
);

export default instances;
