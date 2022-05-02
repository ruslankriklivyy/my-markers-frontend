import { makeAutoObservable } from 'mobx';
import { userApi } from '../core/api/user-api';
import { authApi } from '../core/api/auth-api';
import { fileApi } from '../core/api/file-api';

interface User {
  avatar?: { url: string; _id?: string };
  id: string;
  full_name: string;
  email: string;
  is_activated: boolean;
}

export interface UserUpdated {
  full_name?: string;
  avatar?: { url?: string; _id?: string };
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

class UserStore {
  currentUser: User | null = null;
  isUserLoading: boolean = false;

  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getCurrentUser() {
    try {
      const user: User = await userApi.getOne();
      this.setCurrentUser(user);
    } catch (error) {
      const data: AuthResponse = await authApi.refresh();
      this.setCurrentUser(data.user);
    }
  }

  async login(email: string, password: string) {
    try {
      this.isUserLoading = true;
      const data: AuthResponse = await authApi.login(email, password);
      this.setCurrentUser(data.user);
    } catch (error: any) {
      this.setCurrentUser(null);
      this.error = error.message;
    } finally {
      this.isUserLoading = false;
    }
  }

  async signInGoogle(accessToken: string) {
    try {
      this.isUserLoading = true;
      const data = await authApi.signInGoogle(accessToken);
      this.setCurrentUser(data.user);
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.isUserLoading = false;
    }
  }

  async registration(full_name: string, email: string, password: string) {
    try {
      this.isUserLoading = true;
      const data: AuthResponse = await authApi.registration(
        full_name,
        email,
        password,
      );
      this.setCurrentUser(data.user);
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.isUserLoading = false;
    }
  }

  async logout() {
    await authApi.logout();
    this.currentUser = null;
  }

  async update(
    id: string,
    user: Omit<UserUpdated, 'avatar'> & { avatar: File | null },
  ) {
    try {
      this.isUserLoading = true;

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

      this.currentUser = await userApi.update(id, newUser);
      this.isUserLoading = false;
    } catch (error: any) {
      this.error = error.message;
    }
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }
}

export default UserStore;
