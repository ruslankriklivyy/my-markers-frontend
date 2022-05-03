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
import { HexColorPicker } from 'react-colorful';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { mixed, object, string } from 'yup';
import { LocationPosition } from '../../utils/get-current-location';
import { useRootStore } from '../../store/root-state.context';
import { observer } from 'mobx-react-lite';
import UploadImage from '../upload-image';
import CustomFields from '../custom-fields';
import { LayerCustomField } from '../../store/layer-store';
import MarkerIcon from './marker-icon';

export interface MarkerAddFormValues {
  marker_color: string;
  title: string;
  description: string;
  layer: string;
  location: LocationPosition;
  [key: string]: any;
}

interface MarkerAddFormProps {
  lng: number | null;
  lat: number | null;
  onClose: () => void;
}

const MarkerAddForm: FC<MarkerAddFormProps> = observer(
  ({ lng, lat, onClose }) => {
    let schema = object().shape({
      marker_color: string().default('#aabbcc'),
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
    const [customFields, setCustomFields] = useState<LayerCustomField[] | null>(
      null,
    );
    const [validSchema, setValidSchema] = useState<any>(schema);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const {
      register,
      handleSubmit,
      control,
      reset,
      formState: { errors },
    } = useForm<MarkerAddFormValues>({
      resolver: yupResolver(validSchema),
      mode: 'onBlur',
    });

    const onSubmit = async (data: MarkerAddFormValues) => {
      if (!lat || !lng) {
        return;
      }

      const location = { lng, lat };

      setIsLoading(true);
      await markerStore.create(data, location, preview, customFields);

      toast({
        title: markerStore.error ? 'Marker was not created' : 'Marker created.',
        description: markerStore.error ?? "We've created your marker for you.",
        status: markerStore.error ? 'error' : 'success',
        duration: 4000,
        isClosable: true,
      });
      setIsLoading(false);

      if (!markerStore.error) {
        reset();
        onClose && onClose();
      }
    };

    const handleFile = (file: File) => {
      setPreview(file);
    };

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
        layerStore.currentLayer.custom_fields &&
          setCustomFields(layerStore.currentLayer.custom_fields);
      }
    }, [layerStore.currentLayer]);

    useEffect(() => {
      currentLayerId && layerStore.getOne(currentLayerId);
    }, [currentLayerId]);

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={3}>
          <FormLabel htmlFor="preview">Preview</FormLabel>
          <UploadImage onInput={(file: File) => handleFile(file)} />
        </Box>
        <Controller
          control={control}
          name={'marker_color'}
          defaultValue={'#aabbcc'}
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
          <Input {...register('title')} id="title" type="text" />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          mb={3}
          isInvalid={!!errors.description?.message}
          isRequired
        >
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea {...register('description')} id="description" />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        {layerStore.layers && layerStore.layers?.length > 0 && (
          <FormControl isInvalid={!!errors.layer?.message} isRequired>
            <FormLabel htmlFor="layer">Layer</FormLabel>
            <Select
              {...register('layer')}
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
            customFields?.map(({ id, name, type, is_important, items }) => (
              <CustomFields
                key={id}
                name={name}
                type={type}
                is_important={is_important}
                items={items}
                control={control}
                errors={errors}
              />
            ))}
        </Box>
        <Box mt={7} mb={5} display={'flex'} justifyContent={'space-between'}>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            type={'submit'}
            variant={'solid'}
            colorScheme={'green'}
            loadingText={'Creating'}
            isLoading={isLoading}
          >
            Create
          </Button>
        </Box>
      </form>
    );
  },
);

export default MarkerAddForm;
