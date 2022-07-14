import { UserUpdated } from '../../store/user-store';
import { instance } from './axios';

export const userApi = {
  async getOne() {
    try {
      const { data } = await instance.get('/user');
      return data;
    } catch (error) {
      throw Error();
    }
  },

  async update(id: string, user: UserUpdated) {
    try {
      return await instance.patch(`/user/${id}`, user);
    } catch (error: any) {
      throw Error(error.message);
    }
  },
};
