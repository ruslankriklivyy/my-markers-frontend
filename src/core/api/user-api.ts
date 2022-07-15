import { UserUpdated } from '../../store/user-store';
import instances from '../../utils/axios-interceptor';

const commonInstance = instances.commonInstance;

export const userApi = {
  async getOne() {
    const { data } = await commonInstance.get('/user');
    return data;
  },

  async update(id: string, user: UserUpdated) {
    return await commonInstance.patch(`/user/${id}`, user);
  },
};
