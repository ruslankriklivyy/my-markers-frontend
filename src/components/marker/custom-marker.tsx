import React, { FC } from 'react';
import { Marker } from 'react-map-gl';
import { MarkerData } from '../../store/markerStore';
import pinIcon from '../../assets/icons/pin.png';

interface CustomMarkerProps extends MarkerData {
  openMarkerPopup: (marker: MarkerData) => void;
}

const CustomMarker: FC<CustomMarkerProps> = ({
  _id,
  title,
  description,
  layer,
  location,
  openMarkerPopup,
}) => {
  return (
    <Marker
      longitude={location.lng}
      latitude={location.lat}
      anchor="top"
      onClick={() =>
        openMarkerPopup({ _id, title, description, layer, location })
      }
    >
      <img width={33} height={33} src={pinIcon} alt={'pin'} />
    </Marker>
  );
};

export default CustomMarker;
