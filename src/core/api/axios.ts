import Axios from 'axios';

export const instance = Axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

export const fileInstance = Axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'Content-Type': 'multipart/form-data;',
  },
});
