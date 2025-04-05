import { doc, getDoc, setDoc,  arrayUnion, updateDoc} from "firebase/firestore";
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

export const addFriend = async (currentUserId, friendUserId) => {
  try {
    // First get the friend's username
    const friendDoc = await getDoc(doc(db, "profiles", friendUserId));
    if (!friendDoc.exists()) {
      throw new Error("Friend user not found");
    }
    
    const friendData = friendDoc.data();
    const friendInfo = {
      userId: friendUserId,
      username: friendData.username || friendData.displayName || "Unknown"
    };

    // Update current user's friends array
    const userRef = doc(db, "friends", currentUserId);
    await updateDoc(userRef, {
      friends: arrayUnion(friendInfo)
    });
    
    return friendInfo;
  } catch (error) {
    console.error("Error adding friend:", error);
    throw error;
  }
};

export const getUserFriends = async (userId) => {
  const userRef = doc(db, "friends", userId);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.friends || [];
};


export const createUserProfile = async (uid, profile) => {
  const userDoc = doc(db, "users", uid);
  await setDoc(userDoc, profile);
};

export const accountProfile = async (uid, profile) => {
  const userDoc = doc(db, "profiles", uid);
  await setDoc(userDoc, profile);
};

