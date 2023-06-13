import React, { Dispatch, SetStateAction, useEffect } from "react";

const GeolocationComponent: React.FC<{
  setGeolocationPosition: Dispatch<
    SetStateAction<GeolocationPosition | undefined>
  >;
}> = ({ setGeolocationPosition }) => {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((geolocationPosition) => {
        setGeolocationPosition(geolocationPosition);
      });
    }
  }, []);

  return null;
};

export default GeolocationComponent;
