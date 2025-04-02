import React from "react";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      {user && <UserProfile />}
      <BottomNav/>
    </div>
  );
};

export default Profile;