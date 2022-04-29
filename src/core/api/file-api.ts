import { fileInstance } from './axios';

export const fileApi = {
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
