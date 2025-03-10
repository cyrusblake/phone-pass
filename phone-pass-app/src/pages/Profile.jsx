import React from "react";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <h1>Profile</h1>
      
      {user && <UserProfile />}
    </div>
  );
};

export default Profile;