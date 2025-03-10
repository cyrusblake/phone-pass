import React, { useState, useEffect, use } from "react";
import { getUserProfile, getUserAccount, createUserProfile, accountProfile} from "../api/firestore";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uuid, setUid] = useState("");

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const profileData = await getUserProfile(user.uid);
        setProfile(profileData);
        setName(profileData?.name || "");
        setEmail(profileData?.email || "");
       
        

      };
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const accountData = await getUserAccount(user.uid);
        setProfile(accountData);
        setUid(accountData?.username);
        

      };
      fetchProfile();
    }
  }, [user]);



  const handleSave = async () => {
    if (user) {
      await createUserProfile(user.uid, {
        email: user.email,
        name: name,
        uid: user.uid
      });
      alert("Profile saved!");
    }
  };

  const handleSave2 = async () => {
    if (user) {
      await accountProfile(user.uid, {
        uid: user.uid,
        username: user.username
      });
      alert("Profile saved!");
    }
  };

  return (
    <div>
      <h2>{name}</h2>
      <h2>{email}</h2>
      <h2>{uuid}</h2>
      <input
        type="text"
        // value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleSave}>Save</button>

      <input
        type="text"
        // value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleSave2}>Save</button>
    </div>
  );
};

export default UserProfile;