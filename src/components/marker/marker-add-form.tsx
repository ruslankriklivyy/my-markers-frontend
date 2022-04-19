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
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { LocationPosition } from '../../utils/getCurrentLocation';
import { useRootStore } from '../../store/RootState.Context';
import { observer } from 'mobx-react-lite';

interface FormValues {
  title: string;
  description: string;
  layer: string;
  location: LocationPosition;
}

const schema = object().shape({
  title: string()
    .required('Title is a required field')
    .max(76, 'Max length of title is 255 symbols'),
  description: string()
    .required('Description is a required field')
    .max(255, 'Max length of description is 255 symbols'),
  layer: string().required('Layer is a required field'),
});

interface MarkerAddFormProps {
  lng: number | null;
  lat: number | null;
  onClose: () => void;
}

const MarkerAddForm: FC<MarkerAddFormProps> = observer(
  ({ lng, lat, onClose }) => {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValues>({
      resolver: yupResolver(schema),
      mode: 'onBlur',
    });
    const { markerStore, layerStore } = useRootStore();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const onSubmit = async (data: FormValues) => {
      if (!lat || !lng) {
        return;
      }

      const { title, description, layer } = data;
      const location = { lng, lat };

      setIsLoading(true);
      await markerStore.create(title, description, layer, location);
      onClose && onClose();
      reset();
      setIsLoading(false);
      toast({
        title: 'Marker created.',
        description: "We've created marker",
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    };

    useEffect(() => {
      layerStore.getAll();
    }, []);

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
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
        {layerStore.layers?.length && (
          <FormControl isInvalid={!!errors.layer?.message} isRequired>
            <FormLabel htmlFor="layer">Layer</FormLabel>
            <Select {...register('layer')} placeholder="Select layer">
              {layerStore.layers.map(({ _id, name, type }) => (
                <option key={_id} value={_id}>
                  {name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.layer?.message}</FormErrorMessage>
          </FormControl>
        )}
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
