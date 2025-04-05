import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { GeoPoint } from "firebase/firestore"; // Add this import
import { db } from "../api/firebase";

export const getUserLocation = (onSuccess, onError) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`User location: (${latitude}, ${longitude}) with accuracy: ${accuracy} meters`);
        if (accuracy > 1000) {
          console.warn("Geolocation accuracy is low. Results may be inaccurate.");
        }
        onSuccess(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location", error);
        if (onError) onError(error);
      },
      {
        timeout: 10000,
        maximumAge: 0,
        enableHighAccuracy: true,
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    if (onError) onError(new Error("Geolocation not supported"));
  }
};

export const updateUserLocation = async (userId, latitude, longitude) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      location: new GeoPoint(latitude, longitude),
      lastUpdated: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error("Error updating user location:", error);
    throw error;
  }
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (angle) => (Math.PI / 180) * angle;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};