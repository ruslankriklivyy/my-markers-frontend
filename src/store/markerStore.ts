import { makeAutoObservable } from 'mobx';
import { markersApi, usersApi } from '../core/axios';
import { removeCookie, setCookie } from '../utils/cookies';
import { LocationPosition } from '../utils/getCurrentLocation';

export interface MarkerData {
  _id: string;
  title: string;
  description: boolean;
  layer: string;
  location: LocationPosition;
}

class MarkerStore {
  markers: MarkerData[] | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getAll() {
    this.markers = await markersApi.fetchAll();
  }

  async create(
    title: string,
    description: string,
    layer: string,
    location: LocationPosition,
  ) {
    await markersApi.create(title, description, layer, location);
    await this.getAll();
  }

  async remove(id: string) {
    await markersApi.remove(id);
    await this.getAll();
  }
}

export default MarkerStore;
