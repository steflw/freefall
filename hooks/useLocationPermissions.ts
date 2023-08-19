import { useEffect, useState } from "react";
import * as Location from "expo-location";

export function useLocationPermissions() {
  const [locationPermissions, setLocationPermissions] = useState<boolean>(false);

  useEffect(() => {
    if (locationPermissions) return;
    (async () => {
      try {
        const loc = await Location.requestForegroundPermissionsAsync();
        if (loc.status === 'granted') {
          setLocationPermissions(true);
        } else {
          setLocationPermissions(false);
        }
      } catch(e) {
        console.error("useLocationPermissions error", e);
      }
    })();
  }, []);

  return locationPermissions;
}