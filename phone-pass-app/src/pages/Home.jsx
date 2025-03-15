import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  onSnapshot,
  GeoPoint,
  serverTimestamp,
  query,
  where,
  getDocs,
  increment,
} from "firebase/firestore";
import { db } from "../api/firebase";
import pImage from '../assets/square.png';
import '../styles/components/home.css';

const GEO_DISTANCE_THRESHOLD = 0.1; // Approx 10km, adjust as needed

const Home = () => {
  const { user } = useAuth();
  const [interactedUsers, setInteractedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (user) {
      getUserLocation();
    }
  }, [user]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`User location: (${latitude}, ${longitude}) with accuracy: ${accuracy} meters`);
          if (accuracy > 1000) { // If accuracy is worse than 1km, warn the user
            console.warn("Geolocation accuracy is low. Results may be inaccurate.");
          }
          await updateUserLocation(latitude, longitude);
          checkNearbyUsers(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location", error);
        },
        {
          timeout: 10000, // 10 seconds
          maximumAge: 0, // Do not use a cached position
          enableHighAccuracy: true, // Request high accuracy
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const updateUserLocation = async (latitude, longitude) => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      location: new GeoPoint(latitude, longitude),
      lastUpdated: serverTimestamp(),
    }, { merge: true });
  };

  const checkNearbyUsers = async (latitude, longitude) => {
    if (!user) return;
  
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef, { source: 'server' }); // Force fetch from server
      const nearbyUsers = [];
  
      console.log(`Checking nearby users for ${user.uid} at (${latitude}, ${longitude})`);
      console.log(`Total users in Firestore: ${snapshot.docs.length}`);
  
      for (const docSnap of snapshot.docs) {
        if (docSnap.id !== user.uid) {
          const userData = docSnap.data();
          console.log(`Checking user ${docSnap.id}:`, userData);
  
          if (userData.location) {
            const { latitude: lat2, longitude: lon2 } = userData.location;
            const distance = getDistance(latitude, longitude, lat2, lon2);
            console.log(`Distance to user ${docSnap.id}: ${distance} km`);
  
            if (distance < GEO_DISTANCE_THRESHOLD) { // Use the updated threshold here
              console.log(`User ${docSnap.id} is within the threshold. Logging interaction...`);
  
              // Fetch username and bio from profiles collection
              const profileRef = doc(db, "profiles", docSnap.id);
              const profileSnap = await getDoc(profileRef, { source: 'server' }); // Force fetch from server
              let username = "Unknown";
              let bio = "No bio available";
  
              if (profileSnap.exists()) {
                const profileData = profileSnap.data();
                username = profileData.username || "Unknown";
                bio = profileData.bio || "No bio available";
              }
  
              // Log the interaction with usernames
              await logInteraction(user.uid, docSnap.id, username);
  
              // Fetch meet count from interactions collection
              const interactionId = user.uid < docSnap.id ? `${user.uid}_${docSnap.id}` : `${docSnap.id}_${user.uid}`;
              const interactionRef = doc(db, "interactions", interactionId);
              const interactionSnap = await getDoc(interactionRef, { source: 'server' }); // Force fetch from server
              const meetCount = interactionSnap.exists() ? interactionSnap.data().meetCount : 1;
  
              nearbyUsers.push({ username, bio, meetCount });
            }
          }
        }
      }
  
      console.log("Nearby users:", nearbyUsers);
      setInteractedUsers(nearbyUsers);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking nearby users:", error);
    }
  };

  const logInteraction = async (userId1, userId2, username2) => {
    const interactionId = userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
    const interactionRef = doc(db, "interactions", interactionId);

    try {
      const interactionSnap = await getDoc(interactionRef);
      const now = new Date();

      console.log(`Checking interaction between ${userId1} and ${userId2}`);

      if (interactionSnap.exists()) {
        const interactionData = interactionSnap.data();
        const lastMet = interactionData.lastMet?.toDate(); // Convert Firestore timestamp to JS Date

        console.log(`Last met: ${lastMet}`);

        if (lastMet) {
          const hoursSinceLastMeet = (now - lastMet) / (1000 * 60 * 60); // Convert milliseconds to hours
          console.log(`Hours since last meet: ${hoursSinceLastMeet}`);

          if (hoursSinceLastMeet < 24) {
            console.log("Interaction happened in the last 24 hours. Exiting.");
            return; // Exit function early if interaction happened in the last 24 hours
          }
        }
      }

      // Fetch the username of the current user (userId1)
      const profileRef1 = doc(db, "profiles", userId1);
      const profileSnap1 = await getDoc(profileRef1, { source: 'server' });
      const username1 = profileSnap1.exists() ? profileSnap1.data().username : "Unknown";

      console.log("Updating interaction document...");
      await setDoc(interactionRef, {
        users: [userId1, userId2],
        usernames: [username1, username2], // Add usernames to the interaction document
        meetCount: increment(1), // Increment the count
        lastMet: serverTimestamp(), // Update the lastMet timestamp
      }, { merge: true }); // Use merge to update the existing document

      console.log("Interaction document updated successfully.");
    } catch (error) {
      console.error("Error logging interaction:", error);
    }
  };

  // Calculate the distance between two coordinates (Haversine formula)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (Math.PI / 180) * angle;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  return (
    <>
      <div>
        <Navbar />
        <div className="welcome-banner">
          <h1>Welcome {user ? user.displayName : "Guest"} to PhonePass!</h1>
          <p>Connect with users nearby and exchange data.</p>
        </div>
        {user && (
          <Link to="/profile" className="btn btn-primary">
            Go to Profile
          </Link>
        )}
        <button className="btn btn-secondary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        
        <h2>Interacted Users</h2>
        <div className="interacted-users-container">
          {interactedUsers.length === 0 && !isLoading ? (
            <div className="empty-state">
              <i className="fas fa-users" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <p>No users nearby. Check back later!</p>
            </div>
          ) : (
            interactedUsers.map((interaction, index) => (
              <div className="home-container" key={index}>
                <div>
                  <img src={pImage} className="home-pp" alt="Profile" />
                </div>
                <div>
                  <h3>
                    <strong>{interaction.username}</strong> - Met {interaction.meetCount} time(s)
                  </h3>
                  <h3><em>{interaction.bio}</em></h3>
                  <button className="btn btn-secondary">Send Message</button>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="home-container">
              <div className="skeleton skeleton-pp"></div>
              <div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
        </div>
        <button className="fab" onClick={() => getUserLocation()}>
          ↻
        </button>
      </div>
    </>
  );
};

export default Home;