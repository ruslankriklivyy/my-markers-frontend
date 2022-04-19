export interface LocationPosition {
  lat: number;
  lng: number;
}

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        reject({ lat: 50.44893139966506, lng: 30.46788929024479 });
      },
    );
  });
};
