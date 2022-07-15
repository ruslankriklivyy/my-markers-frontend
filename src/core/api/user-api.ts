import { UserUpdated } from '../../store/user-store';
import { instances } from '../../utils/axios-interceptor';

const commonInstance = instances.commonInstance;

export const userApi = {
  async getOne() {
    try {
      const { data } = await commonInstance.get('/user');
      return data;
    } catch (error) {
      throw Error();
    }
  },

  async update(id: string, user: UserUpdated) {
    try {
      return await commonInstance.patch(`/user/${id}`, user);
    } catch (error: any) {
      throw Error(error.message);
    }
  },
};
