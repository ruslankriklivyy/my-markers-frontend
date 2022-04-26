import React, { FC, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { boolean, object, string } from 'yup';
import { useRootStore } from '../../store/root-state.context';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { LayerData } from '../../store/layer-store';

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
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const onSubmit = async (data: FormValues) => {
    const { name, type } = data;
    const newLayer: Omit<LayerData, '_id'> = {
      name,
      type,
      custom_fields: customFields,
    };

    if (!newLayer.custom_fields) delete newLayer.custom_fields;

    setIsLoading(true);
    await layerStore.create(newLayer);

    toast({
      title: layerStore.error ? 'Layer was not created' : 'Layer created.',
      description: layerStore.error ?? "We've created your Layer for you.",
      status: layerStore.error ? 'error' : 'success',
      duration: 4000,
      isClosable: true,
    });
    setIsLoading(false);

    if (!layerStore.error) {
      onClose && onClose();
      reset();
    }
  };

  const addCustomField = () => {
    const newField = { id: uuidv4(), name: '', type: '' };
    const newCustomFields = [...customFields, newField];
    setCustomFields(newCustomFields);
  };

  const removeCustomField = (id: string) => {
    const newCustomFields = customFields.filter((item) => item.id !== id);
    setCustomFields(newCustomFields);
  };

  const onChangeFieldName = (id: string, name: string) => {
    const newCustomFields = customFields.map((item) => {
      if (item.id === id) {
        item.name = name;
      }
      return item;
    });
    setCustomFields(newCustomFields);
  };

  const onChangeFieldType = (id: string, type: string) => {
    const newCustomFields = customFields.map((item) => {
      if (item.id === id) {
        item.type = type;
      }
      return item;
    });
    setCustomFields(newCustomFields);
  };

  const onChangeFieldImportant = (id: string, is_important: boolean) => {
    const newCustomFields = customFields.map((item) => {
      if (item.id === id) {
        item.is_important = is_important;
      }
      return item;
    });
    setCustomFields(newCustomFields);
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
      {customFields.map(({ id }) => (
        <Box mt={5} key={id}>
          <FormControl mb={3} isRequired>
            <FormLabel htmlFor="fieldName">Enter name</FormLabel>
            <Input
              onChange={(event) => onChangeFieldName(id, event.target.value)}
              id="fieldName"
              type="text"
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel htmlFor="name">Field type</FormLabel>
            <Box display={'flex'} alignItems={'center'}>
              <Select
                placeholder={'Select field type'}
                onChange={(event) => onChangeFieldType(id, event.target.value)}
              >
                <option value="text">Text</option>
                <option value="date">Date</option>
                <option value="multiline">Multiline</option>
                <option value="file">File</option>
              </Select>
              <DeleteIcon
                onClick={() => removeCustomField(id)}
                style={{ cursor: 'pointer' }}
                ml={2}
                w={5}
                h={5}
                color={'red.500'}
              />
            </Box>
          </FormControl>
          <FormControl>
            <Checkbox
              onChange={(event) =>
                onChangeFieldImportant(id, event.target.checked)
              }
            >
              Is important field?
            </Checkbox>
          </FormControl>
        </Box>
      ))}
      <Button
        onClick={addCustomField}
        mt={4}
        color={'green'}
        rightIcon={<AddIcon w={3} h={3} />}
      >
        Add field
      </Button>
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
};

export default LayerAddForm;
