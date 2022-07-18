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

interface UserUpdatePayload {
  user: Omit<UserUpdated, 'avatar'> & { avatar: File | UploadImageData | null };
  oldAvatarId?: string;
}

export interface UserUpdated {
  full_name?: string;
  avatar?: UploadImageData | File | null;
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
  isSending: boolean = false;
  isError: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  getCurrentUser = async () => {
    this.setLoading();

    const user: User = await userApi.getOne();

    if (!user) {
      return this.setError();
    }

    this.setLoaded(() => {
      this.setCurrentUser(user);
      this.error = null;
    });
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
      this.setError();
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
      this.setError();
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
      this.setError();
      this.error = error.message;
    }
  };

  logout = async () => {
    await authApi.logout();
    this.currentUser = null;
    this.error = null;
  };

  updateOne = async (id: string, payload: UserUpdatePayload) => {
    this.setLoading();

    const { user, oldAvatarId } = payload;

    let avatar = user.avatar;

    this.setSending();

    if (user.avatar instanceof File) {
      const data = await fileApi.create(user.avatar);
      avatar = data;
    }

    if (!avatar && oldAvatarId) {
      await fileApi.remove(oldAvatarId);
    }

    const newUser = {
      full_name: user.full_name,
      avatar,
    };

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

  setSending = (func?: () => void) => {
    this.isSending = true;
    this.isError = false;
    this.error = null;

    func && func();
  };

  setLoading = (func?: () => void) => {
    this.isFetching = true;
    this.isError = false;
    this.error = null;

    func && func();
  };

  setLoaded = (func?: () => void) => {
    this.isFetching = false;
    this.isError = false;
    this.isSending = false;

    func && func();
  };

  setError = (func?: () => void) => {
    this.isFetching = false;
    this.isError = true;

    func && func();
  };
}

export default UserStore;
