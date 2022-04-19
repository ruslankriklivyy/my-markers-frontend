import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  Checkbox,
  Heading,
  Stack,
  Button,
  Text,
  useDisclosure,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import CustomModal from '../custom-modal';
import LayerAddForm from './layer-add-form';
import { useRootStore } from '../../store/RootState.Context';
import { observer } from 'mobx-react-lite';
import { DeleteIcon } from '@chakra-ui/icons';

const LayerControl = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRemove,
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
  } = useDisclosure();
  const { layerStore } = useRootStore();
  const [currentLayerId, setCurrentLayerId] = useState<string | null>(null);

  const handleCheckedChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      layerStore.addCurrentLayerId(id);
    } else {
      layerStore.removeCurrentLayerId(id);
    }
  };

  const openRemoveModal = (id: string) => {
    setCurrentLayerId(id);
    onOpenRemove();
  };

  const removeLayer = () => {
    if (currentLayerId) {
      layerStore.remove(currentLayerId);
      onCloseRemove();
    }
  };

  useEffect(() => {
    layerStore.getAll();
  }, []);

  useEffect(() => {
    layerStore.layers?.length &&
      layerStore.setCurrentLayerIds(layerStore.layers.map(({ _id }) => _id));
  }, [layerStore.layers]);

  return (
    <Box
      minWidth={170}
      background={'#fff'}
      borderRadius={5}
      boxShadow={'2xl'}
      p={3}
      position={'absolute'}
      top={110}
      right={3}
    >
      <Heading as="h4" size="md" mb={4}>
        Layers
      </Heading>
      <Stack spacing={[1, 3]}>
        {layerStore.layers?.length ? (
          layerStore.layers.map(({ _id, name, type }) => (
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Checkbox
                key={_id}
                defaultChecked={true}
                onChange={(event) => handleCheckedChange(event, _id)}
                value={_id}
                colorScheme="green"
              >
                {name}
              </Checkbox>
              <DeleteIcon
                onClick={() => openRemoveModal(_id)}
                w={4}
                h={4}
                color="red.500"
                cursor={'pointer'}
              />
            </Box>
          ))
        ) : (
          <Text fontSize="sm" fontWeight={500} opacity={0.4}>
            Empty data
          </Text>
        )}
      </Stack>
      <Button onClick={onOpen} color={'green'} mt={3} isFullWidth>
        Create
      </Button>
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <LayerAddForm onClose={onClose} />
      </CustomModal>
      {currentLayerId && (
        <CustomModal isOpen={isOpenRemove} onClose={onCloseRemove}>
          <Stack p={3}>
            <Alert status="warning" mb={5}>
              <AlertIcon />
              All markers with this layer will be removed
            </Alert>
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Button onClick={onCloseRemove}>Close</Button>
              <Button onClick={removeLayer} color={'red'}>
                Remove layer
              </Button>
            </Box>
          </Stack>
        </CustomModal>
      )}
    </Box>
  );
});

export default LayerControl;
