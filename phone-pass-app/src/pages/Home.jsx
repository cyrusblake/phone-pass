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

const GEO_DISTANCE_THRESHOLD = 0.05; // Approx 5km, adjust as needed

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
          const { latitude, longitude } = position.coords;
          await updateUserLocation(latitude, longitude);
          checkNearbyUsers(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
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
      const snapshot = await getDocs(usersRef);
      const nearbyUsers = [];
  
      for (const docSnap of snapshot.docs) {
        if (docSnap.id !== user.uid) {
          const userData = docSnap.data();
          if (userData.location) {
            const { latitude: lat2, longitude: lon2 } = userData.location;
            const distance = getDistance(latitude, longitude, lat2, lon2);
            if (distance < GEO_DISTANCE_THRESHOLD) {
              await logInteraction(user.uid, docSnap.id);
  
              // Fetch username and bio from profiles collection
              const profileRef = doc(db, "profiles", docSnap.id);
              const profileSnap = await getDoc(profileRef);
              let username = "Unknown";
              let bio = "No bio available";
  
              if (profileSnap.exists()) {
                const profileData = profileSnap.data();
                username = profileData.username || "Unknown";
                bio = profileData.bio || "No bio available";
              }
  
              // Fetch meet count from interactions collection
              const interactionId = user.uid < docSnap.id ? `${user.uid}_${docSnap.id}` : `${docSnap.id}_${user.uid}`;
              const interactionRef = doc(db, "interactions", interactionId);
              const interactionSnap = await getDoc(interactionRef);
              const meetCount = interactionSnap.exists() ? interactionSnap.data().meetCount : 1;
  
              nearbyUsers.push({ username, bio, meetCount });
            }
          }
        }
      }
  
      setInteractedUsers(nearbyUsers);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking nearby users:", error);
    }
  };

  const logInteraction = async (userId1, userId2) => {
    const interactionId = userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
    const interactionRef = doc(db, "interactions", interactionId);
  
    try {
      const interactionSnap = await getDoc(interactionRef);
      const now = new Date();
      
      if (interactionSnap.exists()) {
        const interactionData = interactionSnap.data();
        const lastMet = interactionData.lastMet?.toDate(); // Convert Firestore timestamp to JS Date
  
        if (lastMet) {
          const hoursSinceLastMeet = (now - lastMet) / (1000 * 60 * 60); // Convert milliseconds to hours
          if (hoursSinceLastMeet < 24) {
            return; // Exit function early if interaction happened in the last 24 hours
          }
        }
      }
  
      // Always increment the meetCount, regardless of the time elapsed
      await setDoc(interactionRef, {
        users: [userId1, userId2],
        meetCount: increment(1), // Always increment the count
        lastMet: serverTimestamp(), // Update the lastMet timestamp
      }, { merge: true });
  
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