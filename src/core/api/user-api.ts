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
      const { data } = await instance.patch(`/user/${id}`, user);
      return data;
    } catch (error: any) {
      throw Error(error.message);
    }
  },
};
