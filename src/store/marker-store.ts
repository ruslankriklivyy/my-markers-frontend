import { makeAutoObservable } from 'mobx';
import { format } from 'date-fns';

import { LocationPosition } from '../utils/get-current-location';
import { LayerCustomField } from './layer-store';
import { markerApi } from '../core/api/marker-api';
import { fileApi } from '../core/api/file-api';

import { UploadImageData } from '../components/upload-image';
import { MarkerFormValues } from '../components/marker/marker-form';

interface MarkerEditPayload {
  data: MarkerFormValues;
  location: LocationPosition;
  previewFile?: File | UploadImageData | null;
  oldPreviewId?: string | undefined;
  customFields?: LayerCustomField[] | null;
}

interface MarkerCreatePayload {
  data: MarkerFormValues;
  location: LocationPosition;
  previewFile?: File | UploadImageData | null;
  customFields?: LayerCustomField[] | null;
}

export interface MarkerData {
  _id: string;
  marker_color: string;
  title: string;
  description: string;
  layer: string;
  user: string;
  location: LocationPosition;
  preview?: UploadImageData;
  custom_fields?: MarkerDataCustomFields[];
}

export interface MarkerDataCustomFields extends LayerCustomField {
  value: string;
}

class MarkerStore {
  markers: MarkerData[] | null = null;
  currentMarker: MarkerData | null = null;

  error: string | null = null;

  isFetching: boolean = false;
  isSending: boolean = false;
  isError: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  getAll = async () => {
    this.setLoading();

    const res = await markerApi.getAll();

    if (!res.data) {
      return this.setError();
    }

    this.setLoaded(() => {
      this.markers = res.data;
    });
  };

  getOne = async (id: string) => {
    this.setLoading();

    const res = await markerApi.getOne(id);

    if (!res.data) {
      return this.setError();
    }

    this.setLoaded(() => {
      this.currentMarker = res.data;
    });
  };

  createOne = async (payload: MarkerCreatePayload) => {
    this.setLoading();

    const { data, customFields, previewFile, location } = payload;
    const { marker_color, title, description, layer } = data;
    let newCustomFields: MarkerDataCustomFields[] = [];
    let preview = null;

    if (customFields) {
      for (const field of customFields) {
        const value = data[field.name.toLowerCase()];

        if (value) {
          switch (field.type) {
            case 'file':
              const { url } = await fileApi.create(value);
              newCustomFields.push({
                ...field,
                value: url,
              });
              break;

            case 'date':
              newCustomFields.push({
                ...field,
                value: format(new Date(value), 'MM.dd.yyyy'),
              });
              break;

            default:
              newCustomFields.push({
                ...field,
                value,
              });
          }
        }
      }
    }

    if (previewFile instanceof File) {
      const { url, _id } = await fileApi.create(previewFile);
      preview = { url, _id };
    }

    this.setSending();

    const res = await markerApi.create(
      marker_color,
      title,
      description,
      layer,
      location,
      preview,
      newCustomFields,
    );

    if (!res.data) {
      return this.setError();
    }

    this.setLoading(() => {
      this.getAll();
    });
  };

  updateOne = async (id: string, payload: MarkerEditPayload) => {
    this.setLoading();

    const { data, customFields, previewFile, oldPreviewId, location } = payload;
    const { marker_color, title, description, layer } = data;

    let newCustomFields: MarkerDataCustomFields[] = [];
    let preview = null;

    if (customFields) {
      for (const field of customFields) {
        const value = data[field.name.toLowerCase()];

        if (value) {
          if (field.type !== 'file' && field.type !== 'date') {
            newCustomFields.push({
              ...field,
              value,
            });
          }

          if (field.type === 'date') {
            newCustomFields.push({
              ...field,
              value: format(new Date(value), 'MM.dd.yyyy'),
            });
          }

          if (field.type === 'file' && typeof value === 'object') {
            const { url } = await fileApi.create(value);
            newCustomFields.push({
              ...field,
              value: url,
            });
          }
        }
      }
    }

    if (previewFile instanceof File) {
      const { url, _id } = await fileApi.create(previewFile);
      preview = { url, _id };
    }

    if (!previewFile && oldPreviewId) {
      await fileApi.remove(oldPreviewId);
    }

    this.setSending();

    const res = await markerApi.update(
      id,
      marker_color,
      title,
      description,
      layer,
      location,
      preview,
      newCustomFields,
    );

    if (!res.data) {
      return this.setError();
    }

    this.setLoaded(() => {
      this.currentMarker = null;
      this.getAll();
    });
  };

  async remove(id: string, previewId?: string | undefined) {
    await markerApi.remove(id);
    if (previewId) await fileApi.remove(previewId);
    await this.getAll();
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

export default MarkerStore;
