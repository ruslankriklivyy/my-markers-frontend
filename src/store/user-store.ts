import { makeAutoObservable } from 'mobx';
import { usersApi } from '../core/axios';

interface User {
  avatar?: string;
  id: string;
  full_name: string;
  email: string;
  is_activated: boolean;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

class UserStore {
  currentUser: User | null = null;

  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getCurrentUser() {
    try {
      const user: User = await usersApi.fetchCurrentUser();
      this.setCurrentUser(user);
    } catch (error) {
      const data: AuthResponse = await usersApi.refresh();
      this.setCurrentUser(data.user);
    }
  }

  async login(email: string, password: string) {
    try {
      const data: AuthResponse = await usersApi.login(email, password);
      this.setCurrentUser(data.user);
    } catch (error: any) {
      this.setCurrentUser(null);
      this.error = error.message;
    }
  }

  async signInGoogle(accessToken: string) {
    try {
      const data = await usersApi.signInGoogle(accessToken);
      this.setCurrentUser(data.user);
    } catch (error: any) {
      this.error = error.message;
    }
  }

  async registration(full_name: string, email: string, password: string) {
    try {
      const data: AuthResponse = await usersApi.registration(
        full_name,
        email,
        password,
      );
      this.setCurrentUser(data.user);
    } catch (error: any) {
      this.error = error.message;
    }
  }

  async logout() {
    await usersApi.logout();
    this.currentUser = null;
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }
}

export default UserStore;
