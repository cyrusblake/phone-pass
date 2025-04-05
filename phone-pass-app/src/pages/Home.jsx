import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import '../styles/components/home.css';
import BottomNav from "../components/BottomNav";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { getUserLocation, updateUserLocation, getDistance } from "../utils/geolocation";
import { addFriend } from "../api/firestore";
import { logInteraction, checkNearbyUsers } from "../utils/interactions";

const GEO_DISTANCE_THRESHOLD = 0.1; // Approx 10km, adjust as needed

const Home = () => {
  const { user } = useAuth();
  const [interactedUsers, setInteractedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (user) {
      handleGetUserLocation();
    }
  }, [user]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);


  const handleGetUserLocation = () => {
    getUserLocation(
      async (latitude, longitude) => {
        await updateUserLocation(user.uid, latitude, longitude);
        const users = await checkNearbyUsers(
          user.uid,
          latitude,
          longitude,
          GEO_DISTANCE_THRESHOLD,
          getDistance
        );
        setInteractedUsers(users);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error handling location:", error);
        setIsLoading(false);
      }
    );
  };

  const handleAddFriend = async (friendUserId) => {
    try {
      if (!user || !friendUserId) return;
      const addedFriend = await addFriend(user.uid, friendUserId);
      // Optionally update state to show the new friend immediately
      console.log(`Successfully added ${addedFriend.username} as a friend`);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <>
      <div>
        <Navbar />
        <div className="welcome-banner">
          <h1 className="up-h1">Welcome {user ? user.displayName : "Guest"} to PhonePass!</h1>
          <p className="up-h1">Connect with users nearby and exchange data.</p>
        </div>

        {/* {user && (
          <Link to="/profile" className="btn btn-primary">
            Go to Profile
          </Link>
        )} */}

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
                  <AccountCircleRoundedIcon className="home-pp" sx={{ fontSize: 125 }} />
                </div>
                <div>
                  <PersonAddAltRoundedIcon className="add-b" sx={{ fontSize: 20 }}   onClick={() => handleAddFriend(interaction.userId)}  />
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
        <button className="fab" onClick={handleGetUserLocation}>
          ↻
        </button>
      </div>

      <BottomNav />
    </>
  );
};

export default Home;