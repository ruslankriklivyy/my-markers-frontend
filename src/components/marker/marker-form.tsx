import React, { useEffect, useState, useMemo } from 'react';
import { mixed, object, string } from 'yup';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { HexColorPicker } from 'react-colorful';
import { observer } from 'mobx-react-lite';

import { useRootStore } from '../../store/root-state.context';
import UploadImage, { UploadImageData } from '../upload-image';
import { MarkerData } from '../../store/marker-store';
import MarkerIcon from './marker-icon';
import CustomFields from '../custom-fields';
import { LocationPosition } from '../../utils/get-current-location';
import CustomModal from '../custom-modal';

export interface MarkerFormValues {
  marker_color: string;
  title: string;
  description: string;
  layer: string;
  location: LocationPosition;

  // additional fields
  [key: string]: any;
}

interface MarkerFormProps {
  id?: string;
  markerLocation?: LocationPosition;
  isOpen: boolean;
  onClose: () => void;
  onCloseMarker?: () => void;
}

const getDefaultValues = (marker: Partial<MarkerData> | null) => {
  return {
    title: marker?.title || '',
    description: marker?.description || '',
    marker_color: marker?.marker_color || '',
    layer: marker?.layer,
  };
};

export const MarkerForm: React.FC<MarkerFormProps> = observer(
  ({ id, markerLocation, isOpen, onClose, onCloseMarker }) => {
    let schema = object().shape({
      marker_color: string(),
      title: string()
        .required('Title is a required field')
        .max(76, 'Max length of title is 255 symbols'),
      description: string()
        .required('Description is a required field')
        .max(255, 'Max length of description is 255 symbols'),
      layer: string().required('Layer is a required field'),
    });

    const {
      markerStore: {
        updateOne,
        createOne,
        getOne: getOneMarker,
        isSending,
        currentMarker,
        error,
      },
      layerStore: {
        getAll,
        getOne: getOneLayer,
        setCustomFields,
        customFields,
        layers,
        currentLayer,
      },
    } = useRootStore();

    const [markerPreview, setMarkerPreview] = useState<
      File | UploadImageData | null
    >(null);
    const [currentLayerId, setCurrentLayerId] = useState<string | null>(null);
    const [validSchema, setValidSchema] = useState<any>(schema);

    const toast = useToast();

    const {
      register,
      handleSubmit,
      control,
      reset,
      formState: { errors },
    } = useForm<MarkerFormValues>({
      resolver: yupResolver(validSchema),
      mode: 'onBlur',
    });

    const onCancel = () => {
      onClose();
      onCloseMarker && onCloseMarker();
      setCurrentLayerId(null);
      setMarkerPreview(null);
      setCustomFields([]);
      reset();
    };

    const onSubmit = async (data: MarkerFormValues) => {
      if (!id || !currentMarker) {
        if (!markerLocation) {
          return toast({
            title: 'Marker was not created',
            description: 'Location not found',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        }

        await createOne({
          data,
          location: markerLocation,
          previewFile: markerPreview,
          customFields,
        });

        toast({
          title: error ? 'Marker was not created' : 'Marker created',
          description: error ?? "We've created your marker for you",
          status: error ? 'error' : 'success',
          duration: 4000,
          isClosable: true,
        });
      } else {
        const location = {
          lng: currentMarker.location.lng,
          lat: currentMarker.location.lat,
        };

        await updateOne(currentMarker._id, {
          data,
          location,
          previewFile: markerPreview,
          oldPreviewId: currentMarker?.preview?._id,
          customFields,
        });

        toast({
          title: 'Marker edit',
          description: "We've edited marker",
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }

      onCancel();
    };

    const onChangeLayer = (layerId: string) => {
      setCurrentLayerId(layerId);
      getOneLayer(layerId);
    };

    const defaultValues = useMemo(() => {
      return getDefaultValues(id ? currentMarker : null);
    }, [currentMarker, id]);

    useEffect(() => {
      if (currentLayer?.custom_fields?.length) {
        for (const field of currentLayer.custom_fields) {
          if (field.is_important) {
            // @ts-ignore
            schema = schema.shape({
              [field.name.toLowerCase()]:
                field.type !== 'file'
                  ? string().required()
                  : mixed().required(),
            });
          }
        }

        setValidSchema(schema);
        setCustomFields(currentLayer.custom_fields);
      }
    }, [currentLayer]);

    useEffect(() => {
      if (id && currentMarker?.custom_fields) {
        setCurrentLayerId(currentMarker.layer);
        setCustomFields(currentMarker?.custom_fields ?? []);
      }
    }, [id, currentMarker]);

    useEffect(() => {
      if (id) {
        getOneMarker(id);
      }
    }, [id, getOneMarker]);

    useEffect(() => {
      if (id) {
        setMarkerPreview(currentMarker?.preview || null);
      }
    }, [id, currentMarker?.preview]);

    useEffect(() => {
      getAll();
    }, [getAll]);

    useEffect(() => {
      reset(defaultValues);
    }, [reset, defaultValues]);

    return (
      <CustomModal isOpen={isOpen} onClose={onCancel}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={3}>
            <FormLabel htmlFor={'preview'}>Preview</FormLabel>

            <UploadImage
              image={markerPreview}
              onInput={setMarkerPreview}
              onRemove={() => setMarkerPreview(null)}
            />
          </Box>

          <Controller
            control={control}
            name={'marker_color'}
            render={({ field: { value, onChange } }) => (
              <FormControl mb={3}>
                <FormLabel>Marker color</FormLabel>

                <Box display={'flex'} justifyContent={'space-between'}>
                  <HexColorPicker color={value} onChange={onChange} />

                  <MarkerIcon color={value} />
                </Box>
              </FormControl>
            )}
          />

          <FormControl mb={3} isInvalid={!!errors.title?.message} isRequired>
            <FormLabel htmlFor={'title'}>Title</FormLabel>

            <Input {...register('title')} id={'title'} type={'text'} />

            <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
          </FormControl>

          <FormControl
            mb={3}
            isInvalid={!!errors.description?.message}
            isRequired
          >
            <FormLabel htmlFor={'description'}>Description</FormLabel>

            <Textarea {...register('description')} id={'description'} />

            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>

          {layers && layers?.length > 0 && (
            <FormControl isInvalid={!!errors.layer?.message} isRequired>
              <FormLabel htmlFor={'layer'}>Layer</FormLabel>

              <Select
                {...register('layer')}
                onChange={(event) => onChangeLayer(event.target.value)}
                placeholder={'Select layer'}
              >
                {layers.map(({ _id, name }) => (
                  <option key={_id} value={_id}>
                    {name}
                  </option>
                ))}
              </Select>

              <FormErrorMessage>{errors.layer?.message}</FormErrorMessage>
            </FormControl>
          )}

          <Box mt={4}>
            {currentLayerId &&
              customFields?.map(
                ({ id, name, type, is_important, items, value }) => (
                  <CustomFields
                    key={id}
                    name={name}
                    type={type}
                    defaultValue={value}
                    is_important={is_important}
                    items={items}
                    control={control}
                    errors={errors}
                  />
                ),
              )}
          </Box>

          <Box mt={7} mb={5} display={'flex'} justifyContent={'space-between'}>
            <Button variant={'ghost'} onClick={onClose}>
              Close
            </Button>

            <Button
              type={'submit'}
              variant={'solid'}
              colorScheme={'green'}
              loadingText={id ? 'Editing' : 'Creating'}
              isLoading={isSending}
            >
              {id ? 'Edit' : 'Create'}
            </Button>
          </Box>
        </form>
      </CustomModal>
    );
  },
);
