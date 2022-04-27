import { makeAutoObservable } from 'mobx';
import { filesApi, markersApi } from '../core/axios';
import { LocationPosition } from '../utils/getCurrentLocation';
import { LayerDataCustomFields } from './layer-store';
import { format } from 'date-fns';

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

export interface MarkerDataCustomFields extends LayerDataCustomFields {
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
    this.markers = await markersApi.fetchAll();
  }

  async getOne(id: string) {
    this.currentMarker = await markersApi.fetchOne(id);
  }

  async create(
    data: any,
    location: LocationPosition,
    previewFile?: File | null,
    customFields?: LayerDataCustomFields[] | null,
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
                const { url } = await filesApi.create(value);
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
        const { url, _id } = await filesApi.create(previewFile);
        preview = { url, _id };
      }

      await markersApi.create(
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
    data: any,
    id: string,
    location: LocationPosition,
    previewFile?: File | null,
    customFields?: LayerDataCustomFields[] | null,
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
              const { url } = await filesApi.create(value);
              newCustomFields.push({
                ...field,
                value: url,
              });
            }
          }
        }
      }

      if (previewFile) {
        const { url, _id } = await filesApi.create(previewFile);
        preview = { url, _id };
      }

      await markersApi.edit(
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
    await markersApi.remove(id);
    if (previewId) await filesApi.remove(previewId);
    await this.getAll();
  }
}

export default MarkerStore;
