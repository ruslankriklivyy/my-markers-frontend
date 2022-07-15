import { LocationPosition } from '../../utils/get-current-location';
import { MarkerDataCustomFields } from '../../store/marker-store';
import { instances } from '../../utils/axios-interceptor';

const commonInstance = instances.commonInstance;

export const markerApi = {
  async getAll() {
    return await commonInstance.get('/markers');
  },

  async getOne(id: string) {
    return await commonInstance.get(`/markers/${id}`);
  },

  async create(
    marker_color: string,
    title: string,
    description: string,
    layer: string,
    location: LocationPosition,
    preview?: { url: string; _id: string } | null,
    customFields?: MarkerDataCustomFields[] | null,
  ) {
    const marker = {
      marker_color,
      title,
      description,
      layer,
      location,
      preview,
      custom_fields: customFields,
    };

    if (!marker.preview) delete marker.preview;
    if (!marker.custom_fields || !marker.custom_fields.length)
      delete marker.custom_fields;

    return await commonInstance.post('/markers/create', marker);
  },

  async update(
    id: string,
    marker_color: string,
    title: string,
    description: string,
    layer: string,
    location: LocationPosition,
    preview?: { url: string; _id: string } | null,
    customFields?: MarkerDataCustomFields[] | null,
  ) {
    const marker = {
      title,
      marker_color,
      description,
      layer,
      location,
      preview,
      custom_fields: customFields,
    };

    if (!marker.custom_fields || !marker.custom_fields.length)
      delete marker.custom_fields;

    return await commonInstance.patch(`/markers/${id}`, marker);
  },

  async remove(id: string) {
    try {
      const { data } = await commonInstance.delete(`/markers/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};
