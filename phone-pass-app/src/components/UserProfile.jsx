import React, { useState, useEffect, use } from "react";
import { getUserProfile, getUserAccount, createUserProfile, accountProfile} from "../api/firestore";
import { useAuth } from "../context/AuthContext";
import '../styles/components/userprofile.css';
import pImage from '../assets/square.png';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [userName, setuserName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const profileData = await getUserProfile(user.uid);
        setProfile(profileData);
        setName(profileData?.name || "");
        setEmail(profileData?.email || "") 
      };
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const accountData = await getUserAccount(user.uid);
        setProfile(accountData);
        setuserName(accountData?.username);
        setBio(accountData?.bio);
        

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
        bio: bio,
        uid: user.uid,
        username: userName
       
      });
      alert("Profile saved!");
    }
  };

  return (
    <div>
      {/* <h2>{name}</h2> */}
      {/* <h2>{email}</h2> */}

      <div className="container">
          <div>
          <img src={pImage} className="pp"></img>
          </div>
          <div>
            <h2>{userName}</h2>
            <h2>{bio}</h2>
          </div>
            

      </div>
      

      {/* <input
        type="text"
        // value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleSave}>Save</button> */}

      <input
        type="text"
        // value={name}
        onChange={(e) => setuserName(e.target.value)}
        placeholder="Enter your name"
      />
      <input
        type="text"
        // value={name}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Enter the bio"
      />
      
      <button onClick={handleSave2}>Save</button>
    </div>
  );
};

export default UserProfile;