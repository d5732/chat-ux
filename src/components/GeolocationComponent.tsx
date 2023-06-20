import React, { useEffect } from "react";

const GeolocationComponent: React.FC = () => {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem("location.latitude", String(latitude));
        localStorage.setItem("location.longitude", String(longitude));
      });
    }
  }, []);

  return null;
};

export default GeolocationComponent;
