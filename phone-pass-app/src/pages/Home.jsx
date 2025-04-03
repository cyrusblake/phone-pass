import React, { useEffect, useState, useCallback } from "react";
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
import BottomNav from "../components/BottomNav";


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
          if (accuracy > 1000) {
            console.warn("Geolocation accuracy is low. Results may be inaccurate.");
          }
          await updateUserLocation(latitude, longitude);
          checkNearbyUsers(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location", error);
        },
        {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true,
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

  // Memoized distance calculation
  const getDistance = useCallback((lat1, lon1, lat2, lon2) => {
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
  }, []);

  // Optimized interaction logging
  const logInteraction = useCallback(async (userId1, userId2) => {
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
    }
  }, []);

  // Optimized nearby users check
  const checkNearbyUsers = useCallback(async (latitude, longitude) => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Run both queries in parallel
      const [usersSnapshot, interactionsSnapshot] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(query(
          collection(db, "interactions"),
          where("users", "array-contains", user.uid)
        ))
      ]);

      const userProfiles = new Map();
      const pastInteractions = new Map();

      // Pre-fetch profiles for interacted users
      const profileFetchPromises = [];
      interactionsSnapshot.forEach(interactionDoc => {
        const interactionData = interactionDoc.data();
        const otherUserId = interactionData.users.find(id => id !== user.uid);
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
        if (docSnap.id !== user.uid && docSnap.data().location) {
          const userData = docSnap.data();
          const { latitude: lat2, longitude: lon2 } = userData.location;
          const distance = getDistance(latitude, longitude, lat2, lon2);

          if (distance < GEO_DISTANCE_THRESHOLD) {
            nearbyUserPromises.push(
              (async () => {
                const [profileSnap] = await Promise.all([
                  getDoc(doc(db, "profiles", docSnap.id)),
                  logInteraction(user.uid, docSnap.id)
                ]);

                let username = "Unknown";
                let bio = "No bio available";
                if (profileSnap.exists()) {
                  const profileData = profileSnap.data();
                  username = profileData.username || "Unknown";
                  bio = profileData.bio || "No bio available";
                }

                const interactionId = user.uid < docSnap.id 
                  ? `${user.uid}_${docSnap.id}` 
                  : `${docSnap.id}_${user.uid}`;
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
      const allUsers = new Map([...pastInteractions, ...nearbyUsers]);
      setInteractedUsers(Array.from(allUsers.values()));
    } catch (error) {
      console.error("Error checking nearby users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, getDistance, logInteraction]);

  return (
    <>
      <div>
        <Navbar />
        <div className="welcome-banner">
          <h1 className="up-h1">Welcome {user ? user.displayName : "Guest"} to PhonePass!</h1>
          <p className="up-h1">Connect with users nearby and exchange data.</p>
        </div>

        {user && (
          <Link to="/profile" className="btn btn-primary">
            Go to Profile
          </Link>
        )}

        <div style={{ width: '10px', display: 'inline-block' }} />

        <button className="btn btn-secondary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        <h2 className="up-h1">Interacted Users</h2>
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
                    <Link to={`/ViewPage/${interaction.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <strong>{interaction.username}</strong>
                    </Link> - Met {interaction.meetCount} time(s)
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

      <BottomNav />
    </>
  );
};

export default Home;