import { makeAutoObservable } from 'mobx';
import { layersApi } from '../core/axios';

export type CustomFieldType = 'text' | 'multiline' | 'date' | 'file' | 'select';

export type LayerType = 'private' | 'public';

export interface LayerDataCustomFields {
  id: string;
  name: string;
  type: CustomFieldType;
  is_important: boolean;
  value?: string;
}

export interface LayerData {
  _id: string;
  name: string;
  user?: string;
  type: LayerType;
  custom_fields?: LayerDataCustomFields[];
}

export interface CheckedLayer {
  layerId: string;
  userId?: string;
}

class LayerStore {
  layers: LayerData[] | null = null;
  currentLayer: LayerData | null = null;
  checkedLayers: CheckedLayer[] | null = null;

  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getAll() {
    this.layers = await layersApi.getAll();
  }

  async getOne(id: string) {
    this.currentLayer = await layersApi.getOne(id);
  }

  async create(newLayer: Omit<LayerData, '_id'>) {
    try {
      await layersApi.create(newLayer);
      await this.getAll();
    } catch (error: any) {
      this.error = error.message;
    }
  }

  async remove(id: string) {
    await layersApi.remove(id);
    await this.getAll();
  }

  setCheckedLayers(checkedLayers: CheckedLayer[] | []) {
    this.checkedLayers = checkedLayers;
  }

  addCheckedLayer(checkedLayer: CheckedLayer) {
    if (!this.checkedLayers) {
      this.checkedLayers = [checkedLayer];
    } else {
      this.checkedLayers = [...this.checkedLayers, checkedLayer];
    }
  }

  removeCheckedLayer(id: string) {
    if (this.checkedLayers) {
      this.checkedLayers = this.checkedLayers.filter(
        (elem) => elem.layerId !== id,
      );
    }
  }
}

export default LayerStore;
