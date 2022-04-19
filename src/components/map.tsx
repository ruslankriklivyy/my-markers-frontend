import React, { FC, useEffect, useState } from 'react';
import Map, {
  Layer,
  NavigationControl,
  ScaleControl,
  Source,
} from 'react-map-gl';
import {
  getCurrentLocation,
  LocationPosition,
} from '../utils/getCurrentLocation';
import { useDisclosure } from '@chakra-ui/react';
import { MapLayerMouseEvent } from 'mapbox-gl';
import CustomModal from './custom-modal';
import MarkerAddForm from './marker/marker-add-form';
import { useRootStore } from '../store/RootState.Context';
import { observer } from 'mobx-react-lite';
import { MarkerData } from '../store/markerStore';
import CustomMarker from './marker/custom-marker';
import MarkerPopup from './marker/marker-popup';
import LayerControl from './layer/layer-control';

const MapComp = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [location, setLocation] = useState<LocationPosition | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [showMarkerPopup, setShowMarkerPopup] = useState(false);
  const [currentMarker, setCurrentMarker] = useState<MarkerData | null>(null);
  const { markerStore, layerStore } = useRootStore();

  const openMarkerAddForm = (event: MapLayerMouseEvent) => {
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
    markerStore.getAll();
  }, [layerStore.layers]);

  useEffect(() => {
    getCurrentLocation()
      .then((location) => {
        setLocation(location as LocationPosition);
      })
      .catch((location) => {
        setLocation(location);
      });
  }, []);

  return (
    <div>
      {location && (
        <Map
          initialViewState={{
            longitude: location.lng,
            latitude: location.lat,
            zoom: 14,
          }}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_GL_KEY}
          style={{ width: '100%', height: 'calc(100vh - 58px)' }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          attributionControl={false}
          onDblClick={(event) => openMarkerAddForm(event)}
        >
          <NavigationControl />
          <LayerControl />
          {markerStore.markers &&
            markerStore.markers.map(
              (marker) =>
                layerStore.currentLayerIds?.includes(marker.layer) && (
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
      )}
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <MarkerAddForm lng={lng} lat={lat} onClose={onClose} />
      </CustomModal>
    </div>
  );
});

export default MapComp;
