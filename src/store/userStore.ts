import { makeAutoObservable } from 'mobx';
import { usersApi } from '../core/axios';
import { removeCookie, setCookie } from '../utils/cookies';

interface User {
  id: string;
  fullName: string;
  email: string;
  isActivated: boolean;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

class UserStore {
  currentUser: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getCurrentUser() {
    try {
      const user: User = await usersApi.fetchCurrentUser();
      this.setCurrentUser(user);
    } catch (error) {
      const data: AuthResponse = await usersApi.refresh();

      localStorage.setItem('accessToken', data.accessToken);
      setCookie('refreshToken', data.refreshToken, 30);
      this.setCurrentUser(data.user);
    }
  }

  async login(email: string, password: string) {
    try {
      const data = await usersApi.login(email, password);

      localStorage.setItem('accessToken', data.accessToken);
      setCookie('refreshToken', data.refreshToken, 30);
      this.setCurrentUser(data.user);
    } catch (error) {
      this.setCurrentUser(null);
    }
  }

  async registration(fullName: string, email: string, password: string) {
    const data = await usersApi.registration(fullName, email, password);

    localStorage.setItem('accessToken', data.accessToken);
    setCookie('refreshToken', data.refreshToken, 30);
    this.setCurrentUser(data.user);
  }

  async logout() {
    await usersApi.logout();
    this.currentUser = null;
    localStorage.removeItem('accessToken');
    removeCookie('refreshToken');
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }
}

export default UserStore;
