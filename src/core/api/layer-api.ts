import { AxiosRequestConfig } from 'axios';

import { LayerData } from '../../store/layer-store';
import instances from '../../utils/axios-interceptor';

const commonInstance = instances.commonInstance;

export const layerApi = {
  async getAll(payload?: AxiosRequestConfig) {
    return await commonInstance.get('/layers', payload);
  },

  async getOne(id: string) {
    return await commonInstance.get(`/layers/${id}`);
  },

  async create(newLayer: Omit<LayerData, '_id'>) {
    try {
      const { data } = await commonInstance.post('/layers/create', newLayer);
      return data;
    } catch (error: any) {
      throw Error(error.message);
    }
  },

  async remove(id: string) {
    try {
      const { data } = await commonInstance.delete(`/layers/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};
