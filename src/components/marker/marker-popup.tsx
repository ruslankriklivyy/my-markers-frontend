import React, { FC } from 'react';
import { Popup } from 'react-map-gl';
import { MarkerData } from '../../store/markerStore';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useRootStore } from '../../store/RootState.Context';

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
  const { markerStore } = useRootStore();

  const removeMarker = () => {
    markerStore.remove(currentMarker._id);
    onClose();
  };

  return (
    <Popup
      longitude={currentMarker.location.lng}
      latitude={currentMarker.location.lat}
      anchor="bottom"
      closeOnClick={false}
      focusAfterOpen={false}
      onOpen={() => onOpen()}
      onClose={() => onClose()}
    >
      <Heading as="h4" size="md" mt={2} mb={2}>
        {currentMarker.title}
      </Heading>
      <Text fontSize="md">{currentMarker.description}</Text>
      <Box mt={5}>
        <Button onClick={removeMarker} color={'red'} isFullWidth>
          Remove
        </Button>
      </Box>
    </Popup>
  );
};

export default MarkerPopup;
