import { getFirestore, doc, getDoc, setDoc, collection, query, where, GeoPoint, serverTimestamp } from "firebase/firestore";
import { db } from './firebase';

export const getUserProfile = async (uid) => {
  const userDoc = doc(db, "users", uid);
  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    return userSnapshot.data();
  } else {
    console.log("No such user!");
    return null;
  }
};

export const getUserAccount = async (uid) => {
  const userDoc = doc(db, "profiles", uid);
  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    return userSnapshot.data();
  } else {
    console.log("No such user!");
    return null;
  }
};

export const createUserProfile = async (uid, profile) => {
  const userDoc = doc(db, "users", uid);
  await setDoc(userDoc, profile);
};

export const accountProfile = async (uid, profile) => {
  const userDoc = doc(db, "profiles", uid);
  await setDoc(userDoc, profile);
};

