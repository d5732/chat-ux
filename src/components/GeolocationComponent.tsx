import React, { useEffect } from "react";

const GeolocationComponent: React.FC = () => {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem("location.latitude", String(latitude));
        localStorage.setItem("location.longitude", String(longitude));
      });
    } else {
      // fallback if navigator.geolocation disabled, for demo purposes only. Egen @ 41.8033688,-88.1439369
      localStorage.setItem("location.latitude", String(41.8033688));
      localStorage.setItem("location.longitude", String(-88.1439369));
    }
  }, []);

  return null;
};

export default GeolocationComponent;
