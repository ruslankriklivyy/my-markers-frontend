import React, { FC } from 'react';
import { Marker } from 'react-map-gl';
import { MarkerData } from '../../store/marker-store';
import { Tooltip, useColorMode } from '@chakra-ui/react';

interface CustomMarkerProps extends MarkerData {
  openMarkerPopup: (marker: MarkerData) => void;
}

const CustomMarker: FC<CustomMarkerProps> = ({
  _id,
  marker_color,
  title,
  description,
  layer,
  user,
  location,
  preview,
  custom_fields,
  openMarkerPopup,
}) => {
  return (
    <Marker
      longitude={location.lng}
      latitude={location.lat}
      anchor="top"
      onClick={() =>
        openMarkerPopup({
          _id,
          marker_color,
          title,
          description,
          layer,
          user,
          location,
          preview,
          custom_fields,
        })
      }
    >
      <Tooltip label={title} aria-label="A tooltip" placement={'top'} hasArrow>
        <div className={'marker-pin'}>
          <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="413.099px"
            height="413.099px"
            viewBox="0 0 413.099 413.099"
            xmlSpace="preserve"
          >
            <g>
              <g>
                <path
                  fill={marker_color}
                  d="M206.549,0L206.549,0c-82.6,0-149.3,66.7-149.3,149.3c0,28.8,9.2,56.3,22,78.899l97.3,168.399c6.1,11,18.4,16.5,30,16.5
			c11.601,0,23.3-5.5,30-16.5l97.3-168.299c12.9-22.601,22-49.601,22-78.901C355.849,66.8,289.149,0,206.549,0z M206.549,193.4
			c-30,0-54.5-24.5-54.5-54.5s24.5-54.5,54.5-54.5s54.5,24.5,54.5,54.5C261.049,169,236.549,193.4,206.549,193.4z"
                />
              </g>
            </g>
          </svg>
        </div>
      </Tooltip>
    </Marker>
  );
};

export default CustomMarker;
