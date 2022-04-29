import { LayerData } from '../../store/layer-store';
import { instance } from './axios';

export const layerApi = {
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
