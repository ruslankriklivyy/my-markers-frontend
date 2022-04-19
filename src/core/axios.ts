import Axios from 'axios';
import { LocationPosition } from '../utils/getCurrentLocation';

const instance = Axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});

export const markersApi = {
  async fetchAll() {
    try {
      const { data } = await instance.get('/markers');
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async create(
    title: string,
    description: string,
    layer: string,
    location: LocationPosition,
  ) {
    try {
      const { data } = await instance.post('/markers/create', {
        title,
        description,
        layer,
        location,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async remove(id: string) {
    try {
      const { data } = await instance.delete(`/markers/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};

export const layersApi = {
  async getAll() {
    try {
      const { data } = await instance.get('/layers');
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async create(name: string, type: 'private' | 'public') {
    try {
      const { data } = await instance.post('/layers/create', { name, type });
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async remove(id: string) {
    try {
      const { data } = await instance.delete(`/layers/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};

export const usersApi = {
  async login(email: string, password: string) {
    try {
      const { data } = await instance.post('/login', { email, password });
      return data;
    } catch (error) {
      throw Error();
    }
  },

  async registration(fullName: string, email: string, password: string) {
    try {
      const { data } = await instance.post('/registration', {
        fullName,
        email,
        password,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async refresh() {
    try {
      const { data } = await instance.get('/refresh');
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async logout() {
    try {
      const { data } = await instance.post('/logout');
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async fetchCurrentUser() {
    try {
      const { data } = await instance.get('/user');
      return data;
    } catch (error) {
      throw Error();
    }
  },
};
