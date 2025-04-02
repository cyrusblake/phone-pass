import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebase";
import Navbar from "../components/Navbar";
import pImage from '../assets/square.png';
import '../styles/components/userprofile.css';

const ViewPage = () => {
  const { userId } = useParams(); // Extract userId from the URL
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div>
      <Navbar/>
      <div className="profile-heading">
              <h1 className="up-h1">Profile</h1>
            </div>
            <div className="container">
              <div>
                <img src={pImage} className="pp" alt="Profile" />
              </div>
              <div className="user-info">
               <h1>{userProfile.username}</h1>
                <p>{userProfile.bio}</p>
              </div>
            </div>
        <div/>


      
      {/* Add more profile details here */}
    </div>
  );
};

export default ViewPage;