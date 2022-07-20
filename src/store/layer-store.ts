import { makeAutoObservable } from 'mobx';
import { AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { layerApi } from '../core/api/layer-api';
import { PAGINATION_LIMIT } from '../utils/constants';

export type CustomFieldType = 'text' | 'multiline' | 'date' | 'file' | 'select';
export type LayerType = 'private' | 'public';

export interface LayerCustomField {
  id: string;
  name: string;
  type: CustomFieldType;
  is_important: boolean;
  value?: string;
  items?: string[];
}

export interface LayerData {
  _id: string;
  name: string;
  user?: string;
  type: LayerType;
  custom_fields?: LayerCustomField[];
}

export interface CheckedLayer {
  layerId: string;
  userId?: string;
}

class LayerStore {
  layers: LayerData[] = [];
  currentLayer: LayerData | null = null;
  checkedLayers: CheckedLayer[] = [];

  customFields: LayerCustomField[] = [];
  customFieldSelectItems: { fieldId: string; values: string[] }[] = [];

  pagination: Record<string, any> = {
    hasNextPage: true,
    hasPrevPage: false,
    limit: PAGINATION_LIMIT,
    offset: 0,
    page: 1,
    totalDocs: 0,
    totalPages: 0,
  };

  error: string | null = null;

  isFetching: boolean = false;
  isSending: boolean = false;
  isError: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  getAll = async (payload?: AxiosRequestConfig) => {
    this.setLoading();

    const res = await layerApi.getAll(payload);

    if (!res.data) {
      return this.setError();
    }

    this.setLoaded(() => {
      const { docs, ...paginationData } = res.data;

      this.pagination = paginationData;

      if (this.pagination.page > 1) {
        this.layers = [...this.layers, ...docs];
      } else {
        this.layers = docs;
      }
    });
  };

  getOne = async (id: string) => {
    this.setLoading();

    const res = await layerApi.getOne(id);

    if (!res.data) {
      return this.setError();
    }

    this.setLoaded(() => {
      this.currentLayer = res.data;
      this.customFields = res.data.custom_fields;
    });
  };

  createOne = async (newLayer: Omit<LayerData, '_id'>) => {
    try {
      for (const field of newLayer?.custom_fields!) {
        const values = this.customFieldSelectItems?.find(
          (elem) => elem.fieldId === field.id,
        )?.values;

        if (field.type === 'select' && values?.length) {
          field.items = this.customFieldSelectItems?.find(
            (elem) => elem.fieldId === field.id,
          )?.values;
        }
      }

      const layer = await layerApi.create(newLayer);
      this.layers.push(layer);
    } catch (error: any) {
      this.error = error.message;
    }
  };

  deleteOne = async (id: string) => {
    await layerApi.remove(id);
    await this.getAll();
  };

  get isCheckAll() {
    return this.layers.length === this.checkedLayers?.length;
  }

  addCustomFieldSelectItem = (fieldId: string) => {
    this.customFieldSelectItems = [
      ...this.customFieldSelectItems,
      { fieldId, values: [''] },
    ];
  };

  addValueToSelectItem = (fieldId: string) => {
    this.customFieldSelectItems = this.customFieldSelectItems.map((field) => {
      if (field.fieldId === fieldId) {
        field.values = [...field.values, ''];
      }
      return field;
    });
  };

  removeValueFromSelectItem = (fieldId: string, index: number) => {
    this.customFieldSelectItems = this.customFieldSelectItems.map((field) => {
      if (field.fieldId === fieldId) {
        field.values = field.values.filter((_, i) => i !== index);
      }
      return field;
    });
  };

  removeCustomFieldSelectItem = (fieldId: string) => {
    this.customFieldSelectItems = this.customFieldSelectItems.filter(
      (elem) => elem.fieldId !== fieldId,
    );
  };

  changeCustomFieldSelectItem = (
    value: string,
    fieldId: string,
    index: number,
  ) => {
    this.customFieldSelectItems = this.customFieldSelectItems.map((elem) => {
      if (elem.fieldId === fieldId) {
        elem.values[index] = value;
      }
      return elem;
    });
  };

  addCustomField = () => {
    const newField = {
      id: uuidv4(),
      name: '',
      type: '' as CustomFieldType,
      is_important: false,
    };
    const newCustomFields = [...this.customFields, newField];
    this.setCustomFields(newCustomFields);
  };

  removeCustomField = (id: string) => {
    const newCustomFields = this.customFields.filter((item) => item.id !== id);
    this.setCustomFields(newCustomFields);
  };

  changeFieldValue = (
    id: string,
    fieldName: keyof LayerCustomField,
    value: never,
  ) => {
    const newCustomFields = this.customFields.map((item) => {
      if (item.id === id) {
        item[fieldName] = value;
      }
      return item;
    });
    this.setCustomFields(newCustomFields);
  };

  setCustomFields = (fields: LayerCustomField[]) => {
    this.customFields = fields;
  };

  initCheckedLayers = () => {
    if (this.layers.length) {
      this.setCheckedLayers(
        this.layers.map(({ _id, user }) => {
          return { layerId: _id, userId: user };
        }),
      );
    }
  };

  setCheckedLayers = (checkedLayers: CheckedLayer[] | []) => {
    this.checkedLayers = checkedLayers;
  };

  addCheckedLayer = (checkedLayer: CheckedLayer) => {
    if (!this.checkedLayers) {
      this.checkedLayers = [checkedLayer];
    } else {
      this.checkedLayers = [...this.checkedLayers, checkedLayer];
    }
  };

  removeCheckedLayer = (id: string) => {
    if (this.checkedLayers) {
      this.checkedLayers = this.checkedLayers.filter(
        (elem) => elem.layerId !== id,
      );
    }
  };

  checkAndUncheck = (checked: boolean) => {
    if (checked) {
      this.setCheckedLayers(
        this.layers.map(({ _id, user }) => {
          return { layerId: _id, userId: user };
        }) || [],
      );
    } else {
      this.setCheckedLayers([]);
    }
  };

  checkCurrentUserLayers = (checked: boolean, userId: string | undefined) => {
    if (checked) {
      let newCurrentLayerIds = [];

      for (const layer of this.layers) {
        if (layer.user === userId) {
          newCurrentLayerIds.push({
            layerId: layer._id,
            userId: layer.user,
          });
        }
      }

      this.setCheckedLayers(newCurrentLayerIds);
    } else {
      this.setCheckedLayers([]);
    }
  };

  handleCheckedChange = (
    checked: boolean,
    layerId: string,
    userId: string | undefined,
  ) => {
    if (checked) {
      this.addCheckedLayer({
        layerId,
        userId,
      });
    } else {
      this.removeCheckedLayer(layerId);
    }
  };

  setPage = (page: number) => {
    this.pagination.page = page;
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

export default LayerStore;
