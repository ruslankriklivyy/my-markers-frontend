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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from '@chakra-ui/react';
import CustomModal from '../custom-modal';
import LayerAddForm from './layer-add-form';
import { useRootStore } from '../../store/root-state.context';
import { observer } from 'mobx-react-lite';
import { DeleteIcon } from '@chakra-ui/icons';
import layersIcon from '../../assets/icons/layers.png';
import user from '../user';
import { toJS } from 'mobx';

const LayerControl = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRemove,
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
  } = useDisclosure();
  const { layerStore, userStore } = useRootStore();
  const [currentLayerId, setCurrentLayerId] = useState<string | null>(null);

  const handleCheckedChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: string,
    userId: string | undefined,
  ) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      layerStore.addCheckedLayer({
        layerId: id,
        userId,
      });
    } else {
      layerStore.removeCheckedLayer(id);
    }
  };

  const checkUncheckAll = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      layerStore.setCheckedLayers(
        layerStore?.layers?.map((elem) => {
          return { layerId: elem._id, userId: elem.user };
        }) || [],
      );
    } else {
      layerStore.setCheckedLayers([]);
    }
  };

  const checkMyLayers = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      let newCurrentLayerIds = [];

      for (const layer of layerStore?.layers!) {
        if (layer.user === userStore.currentUser?.id) {
          newCurrentLayerIds.push({
            layerId: layer._id,
            userId: layer.user,
          });
        }
      }

      layerStore.setCheckedLayers(newCurrentLayerIds);
    } else {
      layerStore.setCheckedLayers([]);
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
  }, [userStore.currentUser]);

  useEffect(() => {
    layerStore.layers?.length &&
      layerStore.setCheckedLayers(
        layerStore.layers.map(({ _id, user }) => {
          return { layerId: _id, userId: user };
        }),
      );
  }, [layerStore.layers]);

  useEffect(() => {
    currentLayerId && layerStore.getOne(currentLayerId);
  }, [currentLayerId]);

  return (
    <Box position={'absolute'} top={240} right={3}>
      <Popover placement="left" closeOnBlur={false}>
        {/*
        // @ts-ignore */}
        <PopoverTrigger>
          <Button boxShadow={'2xl'}>
            <img width={25} height={35} src={layersIcon} alt={'layers'} />
          </Button>
        </PopoverTrigger>
        <PopoverContent style={{ width: 330 }}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Box minWidth={270} borderRadius={5} p={3}>
              <Box
                mt={2}
                mb={4}
                d={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Heading as="h4" size="md">
                  Layers
                </Heading>
                <Box display={'flex'}>
                  <Checkbox
                    mr={3}
                    isChecked={
                      !!layerStore.checkedLayers?.length &&
                      layerStore.checkedLayers?.every(
                        (elem) => elem?.userId === userStore.currentUser?.id,
                      )
                    }
                    onChange={checkMyLayers}
                  >
                    <Text fontSize="sm">Show my</Text>
                  </Checkbox>
                  <Checkbox
                    isChecked={
                      layerStore.layers?.length ===
                      layerStore.checkedLayers?.length
                    }
                    onChange={checkUncheckAll}
                  >
                    <Text fontSize="sm">Show all</Text>
                  </Checkbox>
                </Box>
              </Box>
              <Stack spacing={[1, 3]}>
                {layerStore.layers?.length ? (
                  layerStore.layers.map(({ _id, name, user }) => (
                    <Box
                      key={_id}
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'space-between'}
                    >
                      <Checkbox
                        defaultChecked
                        onChange={(event) =>
                          handleCheckedChange(event, _id, user)
                        }
                        isChecked={layerStore.checkedLayers?.some(
                          (elem) => elem.layerId === _id,
                        )}
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
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
});

export default LayerControl;
