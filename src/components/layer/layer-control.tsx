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
import { observer } from 'mobx-react-lite';
import { DeleteIcon } from '@chakra-ui/icons';

import CustomModal from '../custom-modal';
import LayerAddForm from './layer-add-form';
import { useRootStore } from '../../store/root-state.context';
import layersIcon from '../../assets/icons/layers.png';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { LAYER_PAGINATION_LIMIT } from '../../utils/constants';

const LayerControl = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRemove,
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
  } = useDisclosure();

  const {
    layerStore: {
      deleteOne,
      getAll,
      initCheckedLayers,
      getOne,
      checkCurrentUserLayers,
      checkAndUncheck,
      handleCheckedChange,
      pagination,
      isCheckAll,
      layers,
      checkedLayers,
    },
    userStore: { currentUser },
  } = useRootStore();

  const [currentLayerId, setCurrentLayerId] = useState<string | null>(null);

  const { containerRef, page } = useInfiniteScroll({
    totalPages: pagination.totalPages,
  });

  const openRemoveModal = (id: string) => {
    setCurrentLayerId(id);
    onOpenRemove();
  };

  const removeLayer = () => {
    if (currentLayerId) {
      deleteOne(currentLayerId);
      onCloseRemove();
    }
  };

  useEffect(() => {
    getAll({ params: { limit: LAYER_PAGINATION_LIMIT, page } });
  }, [getAll, currentUser, page]);

  useEffect(() => {
    initCheckedLayers();
  }, [initCheckedLayers, layers]);

  useEffect(() => {
    currentLayerId && getOne(currentLayerId);
  }, [getOne, currentLayerId]);

  return (
    <Box position={'absolute'} top={240} right={3}>
      <Popover placement="left" closeOnBlur={false}>
        {/*
        // @ts-ignore */}
        <PopoverTrigger>
          <Button boxShadow={'2xl'} zIndex={200}>
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
                  {currentUser && (
                    <Checkbox
                      mr={3}
                      isChecked={
                        checkedLayers.length > 0 &&
                        checkedLayers.every(
                          ({ userId }) => userId === currentUser?._id,
                        )
                      }
                      onChange={(event) =>
                        checkCurrentUserLayers(
                          event.target.checked,
                          currentUser?._id,
                        )
                      }
                    >
                      <Text fontSize="sm">Show my</Text>
                    </Checkbox>
                  )}

                  <Checkbox
                    isChecked={isCheckAll}
                    onChange={(event) => checkAndUncheck(event.target.checked)}
                  >
                    <Text fontSize="sm">Show all</Text>
                  </Checkbox>
                </Box>
              </Box>

              <Stack
                paddingRight={2}
                maxHeight={200}
                overflow={'auto'}
                spacing={[1, 2]}
              >
                {layers.length ? (
                  layers.map(({ _id, name, user }) => (
                    <Box key={_id} className={'layer-item'}>
                      <Checkbox
                        defaultChecked
                        onChange={(event) =>
                          handleCheckedChange(
                            event.target.checked,
                            _id,
                            currentUser?._id,
                          )
                        }
                        isChecked={checkedLayers.some(
                          (elem) => elem.layerId === _id,
                        )}
                        value={_id}
                        colorScheme="green"
                      >
                        {name}
                      </Checkbox>

                      {currentUser?._id === user && (
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

                <div ref={containerRef} style={{ height: 50 }}></div>
              </Stack>

              {currentUser && (
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
