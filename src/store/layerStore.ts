import { makeAutoObservable } from 'mobx';
import { layersApi } from '../core/axios';

export interface LayerData {
  _id: string;
  name: string;
  type: 'public' | 'private';
}

class LayerStore {
  layers: LayerData[] | null = null;
  currentLayerIds: string[] | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getAll() {
    this.layers = await layersApi.getAll();
  }

  async create(name: string, type: 'private' | 'public') {
    await layersApi.create(name, type);
    await this.getAll();
  }

  async remove(id: string) {
    await layersApi.remove(id);
    await this.getAll();
  }

  setCurrentLayerIds(ids: string[]) {
    this.currentLayerIds = ids;
  }

  addCurrentLayerId(id: string) {
    if (!this.currentLayerIds) {
      this.currentLayerIds = [id];
    } else {
      this.currentLayerIds = [...this.currentLayerIds, id];
    }
  }

  removeCurrentLayerId(id: string) {
    if (this.currentLayerIds) {
      this.currentLayerIds = this.currentLayerIds.filter(
        (currentId) => currentId !== id,
      );
    }
  }
}

export default LayerStore;
