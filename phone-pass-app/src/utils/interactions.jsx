import { doc, getDoc, setDoc, serverTimestamp, increment ,collection , query, where, getDocs} from "firebase/firestore";
import { db } from "../api/firebase";
  
export const logInteraction = async (userId1, userId2) => {
    const interactionId = userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
    const interactionRef = doc(db, "interactions", interactionId);
  
    try {
      const interactionSnap = await getDoc(interactionRef);
      const now = new Date();
  
      if (interactionSnap.exists()) {
        const interactionData = interactionSnap.data();
        const lastMet = interactionData.lastMet?.toDate();
        if (lastMet && ((now - lastMet) / (1000 * 60 * 60) < 24)) {
          return;
        }
      }
  
      await setDoc(interactionRef, {
        users: [userId1, userId2],
        meetCount: increment(1),
        lastMet: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Error logging interaction:", error);
      throw error;
    }
  };
  
export const checkNearbyUsers = async (userId, latitude, longitude, distanceThreshold, getDistanceFn) => {
    try {
      // Run both queries in parallel
      const [usersSnapshot, interactionsSnapshot] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(query(
          collection(db, "interactions"),
          where("users", "array-contains", userId)
        ))
      ]);
  
      const userProfiles = new Map();
      const pastInteractions = new Map();
  
      // Pre-fetch profiles for interacted users
      const profileFetchPromises = [];
      interactionsSnapshot.forEach(interactionDoc => {
        const interactionData = interactionDoc.data();
        const otherUserId = interactionData.users.find(id => id !== userId);
        profileFetchPromises.push(
          getDoc(doc(db, "profiles", otherUserId)).then(profileSnap => {
            if (profileSnap.exists()) {
              const profileData = profileSnap.data();
              pastInteractions.set(otherUserId, {
                userId: otherUserId,
                username: profileData.username || "Unknown",
                bio: profileData.bio || "No bio available",
                meetCount: interactionData.meetCount || 1,
                lastMet: interactionData.lastMet?.toDate() || new Date(),
              });
            }
          })
        );
      });
  
      // Process nearby users
      const nearbyUsers = new Map();
      const nearbyUserPromises = [];
  
      usersSnapshot.forEach(docSnap => {
        if (docSnap.id !== userId && docSnap.data().location) {
          const userData = docSnap.data();
          const { latitude: lat2, longitude: lon2 } = userData.location;
          const distance = getDistanceFn(latitude, longitude, lat2, lon2);
  
          if (distance < distanceThreshold) {
            nearbyUserPromises.push(
              (async () => {
                const [profileSnap] = await Promise.all([
                  getDoc(doc(db, "profiles", docSnap.id)),
                  logInteraction(userId, docSnap.id)
                ]);
  
                let username = "Unknown";
                let bio = "No bio available";
                if (profileSnap.exists()) {
                  const profileData = profileSnap.data();
                  username = profileData.username || "Unknown";
                  bio = profileData.bio || "No bio available";
                }
  
                const interactionId = userId < docSnap.id 
                  ? `${userId}_${docSnap.id}` 
                  : `${docSnap.id}_${userId}`;
                const interactionSnap = await getDoc(doc(db, "interactions", interactionId));
                const meetCount = interactionSnap.exists() ? interactionSnap.data().meetCount : 1;
  
                nearbyUsers.set(docSnap.id, { 
                  userId: docSnap.id,
                  username, 
                  bio, 
                  meetCount 
                });
              })()
            );
          }
        }
      });
  
      // Wait for all data to load
      await Promise.all([...profileFetchPromises, ...nearbyUserPromises]);
  
      // Combine results
      return Array.from(new Map([...pastInteractions, ...nearbyUsers]).values());
    } catch (error) {
      console.error("Error checking nearby users:", error);
      throw error;
    }
  };