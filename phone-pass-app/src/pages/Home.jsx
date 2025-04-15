import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebase"; // Adjust path as needed
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

const GEO_DISTANCE_THRESHOLD = 0.1; // Approx 10km

const Home = () => {
  const { user } = useAuth();
  const [interactedUsers, setInteractedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  // const [addingFriend, setAddingFriend] = useState(null);

  useEffect(() => {
    if (user) handleGetUserLocation();
  }, [user]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const handleGetUserLocation = () => {
    setIsLoading(true);
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
  
      // Get friend data from users collection
      const friendDoc = await getDoc(doc(db, "profiles", friendUserId));
      if (!friendDoc.exists()) throw new Error("Friend not found");
  
      const friendData = {
        userId: friendDoc.id,
        username: friendDoc.data().username || 'Anonymous',
        bio: friendDoc.data().bio || '',
        profilePic: friendDoc.data().photoURL || null
      };
  
      // Add friend with client-side timestamp
      await addFriend(user.uid, friendData);
  
      // Update UI state
      setInteractedUsers(prev => prev.map(user => 
        user.userId === friendUserId 
          ? { ...user, isFriend: true } 
          : user
      ));
  
      alert(`Added ${friendData.username} successfully!`);
    } catch (error) {
      console.error('Error adding friend:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <div>
        <Navbar />
        <div className="welcome-banner">
          <h1 className="up-h1">Welcome {user?.displayName || "Guest"} to PassBy!</h1>
          <p className="up-h1">Meet The World Around You!</p>
       
        </div>

        <div className="dark-mode-div">
          <button 
          className="btn btn-secondary" 
          onClick={() => setDarkMode(!darkMode)}
          >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        

        <h2 className="up-h1">Interacted Users</h2>
        <div className="interacted-users-container">
          {interactedUsers.length === 0 && !isLoading ? (
            <div className="empty-state">
              <i className="fas fa-users" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <p>No users nearby. Check back later!</p>
            </div>
          ) : (
            interactedUsers.map((interaction) => (
              <div className="home-container" key={interaction.userId}>
                <div>
                  <AccountCircleRoundedIcon className="home-pp"  sx={{ fontSize: 100 }} />
                </div>
                <div>
                  <PersonAddAltRoundedIcon className="add-b" sx={{ fontSize: 20}} 
                  onClick={() => !interaction.isFriend && handleAddFriend(interaction.userId)}
                  />

                  {/* <PersonAddAltRoundedIcon
                    className={`add-b ${interaction.isFriend ? 'added' : ''}`}
                    sx={{ 
                      fontSize: 20,
                      color: addingFriend === interaction.userId ? 'gray' : 'inherit',
                      cursor: addingFriend ? 'wait' : 'pointer'
                    }}
                    onClick={() => !interaction.isFriend && handleAddFriend(interaction.userId)}
                  /> */}
                  {interaction.isFriend && <span className="friend-added-badge">✓ Friend</span>}
                  <h3>
                    <Link 
                      to={`/ViewPage/${interaction.userId}`} 
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
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