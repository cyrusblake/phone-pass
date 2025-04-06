import { doc, getDoc, setDoc,  arrayUnion,  serverTimestamp, updateDoc} from "firebase/firestore";
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


export const getUserFriends = async (userId) => {
  const userRef = doc(db, "friends", userId);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.friends || [];
};

export const addFriend = async (currentUserId, friendData) => {
  try {
    const friendsRef = doc(db, "friends", currentUserId);
    
    await updateDoc(friendsRef, {
      friends: arrayUnion({
        userId: friendData.userId,
        username: friendData.username,
        // bio: friendData.bio || '',
        // addedAt: new Date().toISOString() 
      })
    });
    
    return true;
  } catch (error) {
    console.error("Error adding friend:", error);
    throw error;
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

