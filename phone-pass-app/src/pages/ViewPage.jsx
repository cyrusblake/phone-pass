import React, { useEffect, useState } from "react"; // Removed unused `use` import
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebase";
import Navbar from "../components/Navbar";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import '../styles/components/userprofile.css';

const ViewPage = () => {
  const { userId } = useParams(); // Extract userId from the URL
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [music, setMusic] = useState([]); // Combined all state declarations at the top

  // Fetch user profile from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileRef = doc(db, "profiles", userId); // Fetch profile data from Firestore
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setUserProfile(profileSnap.data()); // Set profile data if it exists
        } else {
          console.log("No such profile!");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const getMusic = async () => {
    const url = 'https://spotify23.p.rapidapi.com/track_lyrics/?id=4snRyiaLyvTMui0hzp8MF7'; // Define the URL
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'cfd0d991dfmshe0f5d8ab4cd0fa4p1c2781jsn24e05a9314dd', // Use environment variable for security
        'x-rapidapi-host': 'spotify23.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options); // Use the defined URL
      const result = await response.json();
      console.log("API Response:", result); // Debugging: Log the API response
      if (result?.lyrics) {
        setMusic(result.lyrics); // Update state with lyrics data
      } else {
        console.warn("No lyrics data found or unexpected response structure:", result);
      }
    } catch (error) {
      console.error("Error fetching music:", error);
    }
  };
  useEffect(() => {
    getMusic();
  }, []); // Dependency array ensures this runs only once

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div>
      <Navbar />
      {/* <div>
        {music?.lines?.length > 0 ? (
          music.lines.map((line, index) => <p key={index}>{line.words}</p>)
        ) : (
          <p>No lyrics available.</p>
        )}
      </div> */}
      <div className="profile-heading">
        <h1 className="up-h1">Profile</h1>
      </div>
      <div className="container">
        <div>
          <AccountCircleRoundedIcon 
            className="profile-pic" 
            sx={{ fontSize: 150 }} 
          />
        </div>
        <div className="user-info">
          <h1>{userProfile.username}</h1>
          <p>{userProfile.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;