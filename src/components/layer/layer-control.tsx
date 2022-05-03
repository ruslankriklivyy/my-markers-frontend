import React, { useEffect, useState } from 'react';
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

const LayerControl = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRemove,
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
  } = useDisclosure();
  const { layerStore, userStore } = useRootStore();
  const [currentLayerId, setCurrentLayerId] = useState<string | null>(null);

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
    layerStore.initCheckedLayers();
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
                  {userStore.currentUser && (
                    <Checkbox
                      mr={3}
                      isChecked={
                        layerStore.checkedLayers.length > 0 &&
                        layerStore.checkedLayers.every(
                          ({ userId }) => userId === userStore.currentUser?.id,
                        )
                      }
                      onChange={(event) =>
                        layerStore.checkCurrentUserLayers(
                          event.target.checked,
                          userStore.currentUser?.id,
                        )
                      }
                    >
                      <Text fontSize="sm">Show my</Text>
                    </Checkbox>
                  )}
                  <Checkbox
                    isChecked={layerStore.isCheckAll}
                    onChange={(event) =>
                      layerStore.checkAndUncheck(event.target.checked)
                    }
                  >
                    <Text fontSize="sm">Show all</Text>
                  </Checkbox>
                </Box>
              </Box>
              <Stack spacing={[1, 3]}>
                {layerStore.layers.length ? (
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
                          layerStore.handleCheckedChange(
                            event.target.checked,
                            _id,
                            userStore.currentUser?.id,
                          )
                        }
                        isChecked={layerStore.checkedLayers.some(
                          (elem) => elem.layerId === _id,
                        )}
                        value={_id}
                        colorScheme="green"
                      >
                        {name}
                      </Checkbox>
                      {userStore.currentUser?.id === user && (
                        <DeleteIcon
                          onClick={() => openRemoveModal(_id)}
                          w={4}
                          h={4}
                          color={'red.500'}
                          cursor={'pointer'}
                        />
                      )}
                    </Box>
                  ))
                ) : (
                  <Text fontSize="sm" fontWeight={500} opacity={0.4}>
                    Empty data
                  </Text>
                )}
              </Stack>
              {userStore.currentUser && (
                <Button onClick={onOpen} color={'green'} mt={3} isFullWidth>
                  Create
                </Button>
              )}
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
