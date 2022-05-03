import React, { FC, useState } from 'react';
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
import { object, string } from 'yup';
import { useRootStore } from '../../store/root-state.context';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { LayerData } from '../../store/layer-store';
import { observer } from 'mobx-react-lite';

interface FormValues {
  name: string;
  type: 'private' | 'public';
}

const customFieldsTypes = ['text', 'date', 'multiline', 'file', 'select'];

const schema = object().shape({
  name: string()
    .required('Name is a required field')
    .max(76, 'Max length of title is 255 symbols'),
  type: string().required('Type is a required field'),
});

interface LayerAddFormProps {
  onClose: () => void;
}

const LayerAddForm: FC<LayerAddFormProps> = observer(({ onClose }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [customFieldType, setCustomFieldType] = useState('');
  const toast = useToast();

  const onSubmit = async (data: FormValues) => {
    const { name, type } = data;
    const newLayer: Omit<LayerData, '_id'> = {
      name,
      type,
      custom_fields: layerStore.customFields,
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
      {layerStore.customFields.map(({ id }) => (
        <Box mt={5} key={id}>
          <FormControl mb={3} isRequired>
            <FormLabel htmlFor="fieldName">Enter name</FormLabel>
            <Input
              onChange={(event) =>
                layerStore.changeFieldValue(
                  id,
                  'name',
                  event.target.value as never,
                )
              }
              id="fieldName"
              type="text"
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel htmlFor="name">Field type</FormLabel>
            <Box display={'flex'} alignItems={'center'}>
              <Select
                placeholder={'Select field type'}
                onChange={(event) => {
                  layerStore.changeFieldValue(
                    id,
                    'type',
                    event.target.value as never,
                  );
                  event.target.value === 'select' &&
                    layerStore.addCustomFieldSelectItem(id);
                  setCustomFieldType(event.target.value);
                }}
              >
                {customFieldsTypes.map((name) => (
                  <option value={name}>{name}</option>
                ))}
              </Select>
              <DeleteIcon
                onClick={() => layerStore.removeCustomField(id)}
                style={{ cursor: 'pointer' }}
                ml={2}
                w={5}
                h={5}
                color={'red.500'}
              />
            </Box>
            {customFieldType === 'select' &&
              layerStore.customFieldSelectItems.map(({ fieldId, values }) =>
                values.map((name, index) => (
                  <Box
                    key={fieldId}
                    display={'flex'}
                    alignItems={'center'}
                    mt={5}
                  >
                    <Input
                      value={name}
                      onChange={(event) =>
                        layerStore.changeCustomFieldSelectItem(
                          event.target.value,
                          id,
                          index,
                        )
                      }
                    />
                    <DeleteIcon
                      onClick={() =>
                        layerStore.removeValueFromSelectItem(id, index)
                      }
                      style={{ cursor: 'pointer' }}
                      ml={2}
                      w={5}
                      h={5}
                      color={'red.500'}
                    />
                  </Box>
                )),
              )}
            {customFieldType === 'select' && (
              <Button
                onClick={() => layerStore.addValueToSelectItem(id)}
                mt={4}
                color={'green'}
                w={7}
                h={7}
              >
                <AddIcon w={3} h={3} />
              </Button>
            )}
          </FormControl>
          <FormControl>
            <Checkbox
              onChange={(event) =>
                layerStore.changeFieldValue(
                  id,
                  'is_important',
                  event.target.checked as never,
                )
              }
            >
              Is important field?
            </Checkbox>
          </FormControl>
        </Box>
      ))}
      <Button
        onClick={() => layerStore.addCustomField()}
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
});

export default LayerAddForm;
