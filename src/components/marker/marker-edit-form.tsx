import React, { FC, useEffect, useState } from 'react';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { mixed, object, string } from 'yup';
import { LocationPosition } from '../../utils/get-current-location';
import { useRootStore } from '../../store/root-state.context';
import { observer } from 'mobx-react-lite';
import UploadImage from '../upload-image';
import CustomFields from '../custom-fields';
import { LayerCustomField } from '../../store/layer-store';
import { MarkerDataCustomFields } from '../../store/marker-store';
import { HexColorPicker } from 'react-colorful';
import MarkerIcon from './marker-icon';

export interface MarkerEditFormValues {
  marker_color: string;
  title: string;
  description: string;
  layer: string;
  location: LocationPosition;
  [key: string]: any;
}

interface MarkerEditFormProps {
  id: string;
  onClose: () => void;
}

const MarkerEditForm: FC<MarkerEditFormProps> = observer(({ id, onClose }) => {
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

  const { markerStore, layerStore } = useRootStore();
  const [preview, setPreview] = useState<File | null>(null);
  const [currentLayerId, setCurrentLayerId] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<
    MarkerDataCustomFields[] | LayerCustomField[] | null
  >(null);
  const [validSchema, setValidSchema] = useState<any>(schema);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MarkerEditFormValues>({
    resolver: yupResolver(validSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: MarkerEditFormValues) => {
    if (!id || !markerStore.currentMarker) {
      return;
    }

    setIsLoading(true);

    const location = {
      lng: markerStore.currentMarker.location.lng,
      lat: markerStore.currentMarker.location.lat,
    };

    await markerStore.edit(
      data,
      markerStore.currentMarker._id,
      location,
      preview,
      customFields,
    );
    onClose && onClose();

    reset();
    setIsLoading(false);
    toast({
      title: 'Marker edit',
      description: "We've edited marker",
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (markerStore.currentMarker?.custom_fields) {
      setCurrentLayerId(markerStore.currentMarker.layer);
      setCustomFields(markerStore.currentMarker.custom_fields);
    }
  }, [markerStore.currentMarker]);

  useEffect(() => {
    markerStore
      .getOne(id)
      .then(() => setIsFetching(false))
      .catch(() => setIsFetching(false))
      .finally(() => setIsFetching(true));
  }, [id]);

  useEffect(() => {
    layerStore.getAll();
  }, []);

  useEffect(() => {
    if (layerStore.currentLayer) {
      layerStore.currentLayer.custom_fields?.map((item) => {
        if (item.is_important) {
          // @ts-ignore
          schema = schema.shape({
            [item.name.toLowerCase()]:
              item.type !== 'file' ? string().required() : mixed().required(),
          });
        }
      });

      setValidSchema(schema);

      if (
        currentLayerId &&
        layerStore.currentLayer.custom_fields &&
        markerStore.currentMarker?.layer !== currentLayerId
      ) {
        setCustomFields(layerStore.currentLayer.custom_fields);
      } else {
        setCustomFields(markerStore.currentMarker?.custom_fields ?? []);
      }
    }
  }, [markerStore.currentMarker, layerStore.currentLayer, currentLayerId]);

  useEffect(() => {
    currentLayerId && layerStore.getOne(currentLayerId);
  }, [currentLayerId]);

  return isFetching ? (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mb={3}>
        <FormLabel htmlFor="preview">Preview</FormLabel>
        <UploadImage
          defaultValue={markerStore.currentMarker?.preview}
          onInput={(file: File) => setPreview(file)}
        />
      </Box>
      <Controller
        control={control}
        name={'marker_color'}
        defaultValue={markerStore.currentMarker?.marker_color}
        render={({ field: { value, onChange } }) => (
          <FormControl mb={3}>
            <FormLabel>Marker color</FormLabel>
            <Box display={'flex'} justifyContent={'space-between'}>
              <HexColorPicker
                color={value}
                onChange={(color) => onChange(color)}
              />
              <MarkerIcon color={value} />
            </Box>
          </FormControl>
        )}
      />
      <FormControl mb={3} isInvalid={!!errors.title?.message} isRequired>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input
          {...register('title')}
          defaultValue={markerStore.currentMarker?.title}
          id="title"
          type="text"
        />
        <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mb={3} isInvalid={!!errors.description?.message} isRequired>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea
          {...register('description')}
          defaultValue={markerStore.currentMarker?.description}
          id="description"
        />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>
      {layerStore.layers && layerStore.layers?.length > 0 && (
        <FormControl isInvalid={!!errors.layer?.message} isRequired>
          <FormLabel htmlFor="layer">Layer</FormLabel>
          <Select
            {...register('layer')}
            defaultValue={markerStore.currentMarker?.layer}
            onChange={(event) => setCurrentLayerId(event.target.value)}
            placeholder="Select layer"
          >
            {layerStore.layers.map(({ _id, name, type }) => (
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
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button
          type={'submit'}
          variant={'solid'}
          colorScheme={'green'}
          loadingText={'Editing'}
          isLoading={isLoading}
        >
          Edit
        </Button>
      </Box>
    </form>
  ) : (
    <></>
  );
});

export default MarkerEditForm;
