import { makeAutoObservable } from 'mobx';
import { LocationPosition } from '../utils/get-current-location';
import { LayerCustomField } from './layer-store';
import { format } from 'date-fns';
import { markerApi } from '../core/api/marker-api';
import { fileApi } from '../core/api/file-api';
import { MarkerAddFormValues } from '../components/marker/marker-add-form';
import { MarkerEditFormValues } from '../components/marker/marker-edit-form';

export interface MarkerData {
  _id: string;
  marker_color: string;
  title: string;
  description: string;
  layer: string;
  user: string;
  location: LocationPosition;
  preview?: { url: string; _id: string };
  custom_fields?: MarkerDataCustomFields[];
}

export interface MarkerDataCustomFields extends LayerCustomField {
  value: string;
}

class MarkerStore {
  markers: MarkerData[] | null = null;
  currentMarker: MarkerData | null = null;

  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getAll() {
    this.markers = await markerApi.getAll();
  }

  async getOne(id: string) {
    this.currentMarker = await markerApi.getOne(id);
  }

  async create(
    data: MarkerAddFormValues,
    location: LocationPosition,
    previewFile?: File | null,
    customFields?: LayerCustomField[] | null,
  ) {
    try {
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

      if (previewFile) {
        const { url, _id } = await fileApi.create(previewFile);
        preview = { url, _id };
      }

      await markerApi.create(
        marker_color,
        title,
        description,
        layer,
        location,
        preview,
        newCustomFields,
      );
      await this.getAll();
    } catch (error: any) {
      this.error = error.message;
    }
  }

  async edit(
    data: MarkerEditFormValues,
    id: string,
    location: LocationPosition,
    previewFile?: File | null,
    customFields?: LayerCustomField[] | null,
  ) {
    try {
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

      if (previewFile) {
        const { url, _id } = await fileApi.create(previewFile);
        preview = { url, _id };
      }

      await markerApi.update(
        id,
        marker_color,
        title,
        description,
        layer,
        location,
        preview,
        newCustomFields,
      );
      await this.getAll();
    } catch (error: any) {
      this.error = error.message;
    }
  }

  async remove(id: string, previewId?: string | undefined) {
    await markerApi.remove(id);
    if (previewId) await fileApi.remove(previewId);
    await this.getAll();
  }
}

export default MarkerStore;
