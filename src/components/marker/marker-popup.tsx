import React, { FC } from 'react';
import { Popup } from 'react-map-gl';
import { MarkerData } from '../../store/marker-store';
import {
  Box,
  Button,
  Heading,
  Text,
  Image,
  Link,
  useDisclosure,
  useColorMode,
} from '@chakra-ui/react';
import { useRootStore } from '../../store/root-state.context';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import CustomModal from '../custom-modal';
import MarkerEditForm from './marker-edit-form';

interface MarkerPopupProps {
  currentMarker: MarkerData;
  onOpen: () => void;
  onClose: () => void;
}

const MarkerPopup: FC<MarkerPopupProps> = ({
  currentMarker,
  onOpen,
  onClose,
}) => {
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const { markerStore, userStore } = useRootStore();
  const { colorMode } = useColorMode();

  const removeMarker = () => {
    markerStore.remove(currentMarker._id, currentMarker.preview?._id);
    onClose();
  };

  return (
    <>
      <Popup
        longitude={currentMarker.location.lng}
        latitude={currentMarker.location.lat}
        anchor="bottom"
        onOpen={() => onOpen()}
        onClose={() => onClose()}
        closeOnClick={false}
        focusAfterOpen={false}
        className={colorMode === 'dark' ? 'popup-dark' : undefined}
      >
        {currentMarker.preview && (
          <Box mt={4} mb={4} width={'100%'}>
            <Image
              width={'100%'}
              height={'150px'}
              borderRadius={5}
              objectFit={'cover'}
              src={currentMarker.preview.url}
              alt="marker preview"
            />
          </Box>
        )}
        <Heading as="h4" size="md" mt={2} mb={2}>
          {currentMarker.title}
        </Heading>
        <Text fontSize="md" mb={1}>
          {currentMarker.description}
        </Text>
        {currentMarker?.custom_fields?.map(({ id, name, type, value }) => (
          <Box key={id} mt={2}>
            <Heading display={'inline'} as="h5" size="sm" mr={1}>
              {name}:
            </Heading>
            {type !== 'file' && <Text fontSize="sm">{value}</Text>}
            {type === 'file' && (
              <Link
                style={{ fontSize: 14 }}
                color="teal.500"
                href={value}
                download={'file'}
                isExternal
              >
                Link
              </Link>
            )}
          </Box>
        ))}
        <Box
          mt={5}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          {currentMarker.user === userStore.currentUser?.id && (
            <Button onClick={onOpenEdit} w={50} color={'blue.500'} isFullWidth>
              <EditIcon w={5} h={5} />
            </Button>
          )}
          <Button w={50} className={'btn-like'}>
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
            >
              <g>
                <g>
                  <path
                    fill="red"
                    d="M467.204,67.921C412.786,20.394,329.86,25.984,282.31,80.365l-26.311,29.66l-26.311-29.66
			C182.138,25.984,99.212,20.396,44.795,67.921c-54.437,47.543-60.045,130.51-12.503,184.946l185.641,206.535
			c9.692,10.783,23.568,16.968,38.067,16.968c14.499,0,28.375-6.185,38.067-16.968L479.546,253.05l0.161-0.182
			C527.251,198.431,521.641,115.464,467.204,67.921z"
                  />
                </g>
              </g>
            </svg>
          </Button>
          {currentMarker.user === userStore.currentUser?.id && (
            <Button w={50} onClick={removeMarker} color={'red'} isFullWidth>
              <DeleteIcon w={5} h={5} />
            </Button>
          )}
        </Box>
      </Popup>
      <CustomModal isOpen={isOpenEdit} onClose={onCloseEdit}>
        <MarkerEditForm id={currentMarker._id} onClose={onCloseEdit} />
      </CustomModal>
    </>
  );
};

export default MarkerPopup;
