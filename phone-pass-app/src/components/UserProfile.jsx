import React, { useState, useEffect } from "react";
import { getUserProfile, getUserAccount, createUserProfile, accountProfile } from "../api/firestore";
import { useAuth } from "../context/AuthContext";
import '../styles/components/userprofile.css';
import pImage from '../assets/square.png';
import { useNavigate } from "react-router-dom";


const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setuserName] = useState("");
  const [bio, setBio] = useState("");
  
  
   const { user, loading, signIn, signOut } = useAuth();
  
    const handleClick = () => {
      if (user) {
        signOut();
        navigate("/");
      } else {
        signIn();
      }
    };

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
        setuserName(accountData?.username || "");
        setBio(accountData?.bio || "");
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
      <div className="profile-heading">
        <h1 className="up-h1">Profile</h1>
      </div>
      <div className="container">
        
        <img src={pImage} className="pp" alt="Profile" />
        <div className="user-info">
          <h2>{userName}</h2>
          <h2>{bio}</h2>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "20px auto", padding: "0 20px" }}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setuserName(e.target.value)}
          placeholder="Enter your username"
        />
        <input
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Enter your bio"
        />
        <button onClick={handleSave2} className="u-button">Save</button>
      </div>
      <div>

         {!loading && (
                <button 
                  type='button'
                  className='nb'
                  onClick={handleClick}
                >
                  Log {user ? 'out' : 'in'}
                </button>
          )}
      </div>
     
    </div>
  );
};

export default UserProfile;