import React, { useEffect, useState } from 'react';
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from 'react-map-gl';
import {
  getCurrentLocation,
  LocationPosition,
} from '../utils/get-current-location';
import {
  Box,
  Text,
  Spinner,
  useColorMode,
  useDisclosure,
  useToast,
  Button,
} from '@chakra-ui/react';
import CustomModal from './custom-modal';
import MarkerAddForm from './marker/marker-add-form';
import { useRootStore } from '../store/root-state.context';
import { observer } from 'mobx-react-lite';
import { MarkerData } from '../store/marker-store';
import CustomMarker from './marker/custom-marker';
import MarkerPopup from './marker/marker-popup';
import LayerControl from './layer/layer-control';
import ToggleMode from './toggle-mode';
import GeocoderControl from './geocoder-control';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLayerMouseEvent } from 'mapbox-gl';
import { getCookie, setCookie } from '../utils/cookies';

const MapComp = observer(() => {
  const toast = useToast();
  const isAcceptedFromCookie = getCookie('is_accepted_create');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAcceptedCreate, setIsAcceptedCreate] = useState(
    !!isAcceptedFromCookie,
  );
  const [location, setLocation] = useState<LocationPosition | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [showMarkerPopup, setShowMarkerPopup] = useState(false);
  const [currentMarker, setCurrentMarker] = useState<MarkerData | null>(null);
  const { markerStore, layerStore, userStore } = useRootStore();
  const { colorMode } = useColorMode();
  const controlsTheme = {
    bg: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : '#fff',
  };

  const openMarkerAddForm = (event: MapLayerMouseEvent) => {
    if (!userStore.currentUser) {
      return toast({
        title: 'You are not authorized for create marker',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
    }

    const { lat, lng } = event.lngLat;

    setLng(lng);
    setLat(lat);
    onOpen();
  };

  const openMarkerPopup = (marker: MarkerData) => {
    setCurrentMarker(marker);
    setShowMarkerPopup(true);
  };

  useEffect(() => {
    setCookie('is_accepted_create', JSON.stringify(true), 9999);
  }, [isAcceptedCreate]);

  useEffect(() => {
    markerStore.getAll();
  }, [layerStore.layers, userStore.currentUser]);

  useEffect(() => {
    getCurrentLocation().then((location) => {
      setLocation(location as LocationPosition);
    });
  }, []);

  return (
    <>
      {location?.lng && location?.lat ? (
        <Map
          initialViewState={{
            longitude: location.lng,
            latitude: location.lat,
            zoom: 14,
          }}
          doubleClickZoom={false}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_GL_KEY}
          style={{ width: '100%', height: 'calc(100vh - 58px)' }}
          mapStyle={`mapbox://styles/mapbox/${
            colorMode === 'dark' ? 'dark' : 'streets'
          }-v9`}
          attributionControl={false}
          onDblClick={openMarkerAddForm}
        >
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            style={{
              background: controlsTheme.bg,
            }}
            trackUserLocation
          />
          <FullscreenControl
            style={{
              background: controlsTheme.bg,
            }}
          />
          <NavigationControl
            style={{
              background: controlsTheme.bg,
            }}
            visualizePitch
          />
          <GeocoderControl
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_GL_KEY}
            position="top-left"
          />
          <LayerControl />
          <ToggleMode />
          {markerStore.markers &&
            markerStore.markers.map(
              (marker) =>
                layerStore.checkedLayers.some(
                  ({ layerId }) => layerId === marker.layer,
                ) && (
                  <CustomMarker
                    key={marker._id}
                    openMarkerPopup={openMarkerPopup}
                    {...marker}
                  />
                ),
            )}
          {showMarkerPopup && currentMarker && (
            <MarkerPopup
              currentMarker={currentMarker}
              onOpen={() => setShowMarkerPopup(true)}
              onClose={() => setShowMarkerPopup(false)}
            />
          )}
        </Map>
      ) : (
        <Spinner
          position={'absolute'}
          top={'50%'}
          left={'50%'}
          color={'gray.800'}
          emptyColor={'gray.300'}
          size={'xl'}
          thickness="3px"
        />
      )}
      {!isAcceptedCreate && (
        <Box
          display={'flex'}
          alignItems={'center'}
          position={'fixed'}
          textAlign={'center'}
          left={'50%'}
          bottom={5}
          background={'#3182CE'}
          p={2}
          borderRadius={10}
          transform={'translateX(-50%)'}
        >
          <Text mr={3} fontWeight={500} color={'#fff'}>
            Click double on LKM for create marker
          </Text>
          <Button
            onClick={() => setIsAcceptedCreate(true)}
            height={33}
            colorScheme={'green'}
            color={colorMode === 'light' ? '#fff' : undefined}
          >
            Ok
          </Button>
        </Box>
      )}
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <MarkerAddForm lng={lng} lat={lat} onClose={onClose} />
      </CustomModal>
    </>
  );
});

export default MapComp;
