import React, { FC } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { useRootStore } from '../../store/RootState.Context';

interface FormValues {
  name: string;
  type: 'private' | 'public';
}

const schema = object().shape({
  name: string()
    .required('Name is a required field')
    .max(76, 'Max length of title is 255 symbols'),
  type: string().required('Type is a required field'),
});

interface LayerAddFormProps {
  onClose: () => void;
}

const LayerAddForm: FC<LayerAddFormProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });
  const { layerStore } = useRootStore();

  const onSubmit = async (data: FormValues) => {
    const { name, type } = data;

    await layerStore.create(name, type);

    onClose && onClose();
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl mb={3} isInvalid={!!errors.name?.message} isRequired>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input {...register('name')} id="name" type="text" />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.type?.message} isRequired>
        <FormLabel htmlFor="description">Type</FormLabel>
        <Select {...register('type')} placeholder="Select type">
          <option value="private">Private</option>
          <option value="public">Public</option>
        </Select>
        <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
      </FormControl>
      <Box mt={7} mb={5} display={'flex'} justifyContent={'space-between'}>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button type={'submit'} variant={'solid'} colorScheme={'green'}>
          Create
        </Button>
      </Box>
    </form>
  );
};

export default LayerAddForm;
