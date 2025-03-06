// import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "./firebase";

// // Save user profile
// export const saveUserProfile = async (userId, profileData) => {
//   try {
//     await setDoc(doc(db, "users", userId), profileData);
//   } catch (error) {
//     console.error("Error saving user profile:", error);
//     throw error;
//   }
// };

// // Log interaction
// export const logInteraction = async (userId, interactionData) => {
//   try {
//     await setDoc(doc(db, "interactions", userId), interactionData);
//   } catch (error) {
//     console.error("Error logging interaction:", error);
//     throw error;
//   }
// };

// // Get user profile
// export const getUserProfile = async (userId) => {
//   try {
//     const docRef = doc(db, "users", userId);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       return docSnap.data();
//     } else {
//       console.error("No such user!");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     throw error;
//   }
// };

// // Find nearby users
// export const findNearbyUsers = async (latitude, longitude, radius) => {
//   try {
//     const usersRef = collection(db, "users");
//     const q = query(
//       usersRef,
//       where("latitude", ">=", latitude - radius),
//       where("latitude", "<=", latitude + radius),
//       where("longitude", ">=", longitude - radius),
//       where("longitude", "<=", longitude + radius)
//     );
//     const querySnapshot = await getDocs(q);
//     const nearbyUsers = [];
//     querySnapshot.forEach((doc) => {
//       nearbyUsers.push(doc.data());
//     });
//     return nearbyUsers;
//   } catch (error) {
//     console.error("Error finding nearby users:", error);
//     throw error;
//   }
// };