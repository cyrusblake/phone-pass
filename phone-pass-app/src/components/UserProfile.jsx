import React, { useState, useEffect } from "react";
import { getUserProfile, saveUserProfile } from "../api/firestore";

const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getUserProfile(userId);
      setProfile(profileData);
      setName(profileData?.name || "");
    };
    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    await saveUserProfile(userId, { name });
    alert("Profile saved!");
  };

  return (
    <div>
      <h2>User Profile</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default UserProfile;