import Axios, { AxiosError } from 'axios';
import { LocationPosition } from '../utils/getCurrentLocation';
import { LayerData } from '../store/layer-store';
import { MarkerDataCustomFields } from '../store/marker-store';

const instance = Axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

const fileInstance = Axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'Content-Type': 'multipart/form-data;',
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

  async fetchOne(id: string) {
    try {
      const { data } = await instance.get(`/markers/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async create(
    marker_color: string,
    title: string,
    description: string,
    layer: string,
    location: LocationPosition,
    preview?: { url: string; _id: string } | null,
    customFields?: MarkerDataCustomFields[] | null,
  ) {
    try {
      const marker = {
        marker_color,
        title,
        description,
        layer,
        location,
        preview,
        custom_fields: customFields,
      };

      if (!marker.preview) delete marker.preview;
      if (!marker.custom_fields || !marker.custom_fields.length)
        delete marker.custom_fields;

      await instance.post('/markers/create', marker);
    } catch (error: any) {
      throw Error(error.message);
    }
  },

  async edit(
    id: string,
    marker_color: string,
    title: string,
    description: string,
    layer: string,
    location: LocationPosition,
    preview?: { url: string; _id: string } | null,
    customFields?: MarkerDataCustomFields[] | null,
  ) {
    try {
      const marker = {
        title,
        marker_color,
        description,
        layer,
        location,
        preview,
        custom_fields: customFields,
      };

      if (!marker.preview) delete marker.preview;
      if (!marker.custom_fields || !marker.custom_fields.length)
        delete marker.custom_fields;

      const { data } = await instance.patch(`/markers/${id}`, marker);
      return data;
    } catch (error: any) {
      throw Error(error.message);
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

  async getOne(id: string) {
    try {
      const { data } = await instance.get(`/layers/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async create(newLayer: Omit<LayerData, '_id'>) {
    try {
      const { data } = await instance.post('/layers/create', newLayer);
      return data;
    } catch (error: any) {
      throw Error(error.message);
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
  async signInGoogle(accessToken: string) {
    const { data } = await instance.post('/auth/google', { accessToken });
    localStorage.setItem('access_token', data.access_token);
    return data;
  },

  async login(email: string, password: string) {
    try {
      const { data } = await instance.post('/auth/login', { email, password });
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

      localStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error: any) {
      throw Error(error);
    }
  },

  async refresh() {
    try {
      const { data } = await instance.get('/auth/refresh');

      localStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async logout() {
    try {
      const { data } = await instance.post('/auth/logout');

      localStorage.removeItem('access_token');
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

export const filesApi = {
  async create(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await fileInstance.post('/files', formData);
      return data;
    } catch (error: any) {
      throw Error(error.message);
    }
  },

  async remove(id: string) {
    try {
      const { data } = await fileInstance.delete(`/files/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};
