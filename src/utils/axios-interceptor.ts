import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { authApi } from '../core/api/auth-api';

axios.defaults.withCredentials = true;

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const authorization = `Bearer ${localStorage.getItem('access_token')}`;

const instances = {
  commonInstance: axios.create({
    baseURL,
    headers: {
      Authorization: authorization,
    },
  }),

  fileInstance: axios.create({
    baseURL,
    headers: {
      Authorization: authorization,
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
