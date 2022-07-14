import { makeAutoObservable } from 'mobx';

import { userApi } from '../core/api/user-api';
import { authApi } from '../core/api/auth-api';
import { fileApi } from '../core/api/file-api';
import { UploadImageData } from '../components/upload-image';

interface User {
  avatar?: UploadImageData;
  _id: string;
  full_name: string;
  email: string;
  is_activated: boolean;
}

export interface UserUpdated {
  full_name?: string;
  avatar?: UploadImageData;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

class UserStore {
  currentUser: User | null = null;

  error: string | null = null;

  isFetching: boolean = false;
  isError: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  getCurrentUser = async () => {
    this.setLoading();

    try {
      const user: User = await userApi.getOne();

      this.setLoaded(() => {
        this.setCurrentUser(user);
        this.error = null;
      });
    } catch (error) {
      const data: AuthResponse = await authApi.refresh();

      this.setLoaded(() => {
        this.setCurrentUser(data.user);
        document.location.reload();
      });
    }
  };

  login = async (email: string, password: string) => {
    this.setLoading();

    try {
      const data: AuthResponse = await authApi.login(email, password);

      this.setLoaded(() => {
        this.setCurrentUser(data.user);
        this.error = null;
      });
    } catch (error: any) {
      this.setCurrentUser(null);
      this.error = error.message;
    }
  };

  signInGoogle = async (accessToken: string) => {
    this.setLoading();

    try {
      const data = await authApi.signInGoogle(accessToken);

      this.setLoaded(() => {
        this.setCurrentUser(data.user);
        this.error = null;
      });
    } catch (error: any) {
      this.error = error.message;
    }
  };

  registration = async (full_name: string, email: string, password: string) => {
    this.setLoading();

    try {
      const data: AuthResponse = await authApi.registration(
        full_name,
        email,
        password,
      );

      this.setLoaded(() => {
        this.setCurrentUser(data.user);
        this.error = null;
      });
    } catch (error: any) {
      this.error = error.message;
    }
  };

  logout = async () => {
    await authApi.logout();
    this.currentUser = null;
    this.error = null;
  };

  update = async (
    id: string,
    user: Omit<UserUpdated, 'avatar'> & { avatar: File | null },
  ) => {
    this.setLoading();

    let avatar = null;

    if (user.avatar) {
      const data = await fileApi.create(user.avatar);
      avatar = data;
    }

    const newUser = {
      full_name: user.full_name,
      avatar,
    };

    if (!newUser.avatar) delete newUser.avatar;

    const res = await userApi.update(id, newUser);

    if (!res.data) {
      return this.setError();
    }

    this.setLoaded(() => {
      this.currentUser = res.data;
    });
  };

  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }

  setLoading = (func?: () => void) => {
    this.isFetching = true;
    this.isError = false;
    this.error = null;

    func && func();
  };

  setLoaded = (func?: () => void) => {
    this.isFetching = false;
    this.isError = false;

    func && func();
  };

  setError = (func?: () => void) => {
    this.isFetching = false;
    this.isError = true;

    func && func();
  };
}

export default UserStore;
