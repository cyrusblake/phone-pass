import React, { useState, useEffect } from "react";
import { getUserProfile, getUserAccount, createUserProfile } from "../api/firestore";
import { useAuth } from "../context/AuthContext";
import '../styles/components/userprofile.css';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setuserName] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  
  const { user, loading, signIn, signOut } = useAuth();
  
  const handleClick = () => {
    if (user) {
      signOut();
      navigate('/');
    } else {
      signIn();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const accountData = await getUserAccount(user.uid);
        setProfile(accountData);
        setuserName(accountData?.username || "");
        setBio(accountData?.bio || "");
        setInterests(accountData?.interests || []); // Initialize interests from accountData
        
        // If there's a profile image URL in the account data, use it
        if (accountData?.profileImageUrl) {
          setImagePreview(accountData.profileImageUrl);
        }
      };
      fetchProfile();
    }
  }, [user]);

  return (
    <div>
      <div className="profile-heading">
        <h1 className="up-h1">Profile</h1>
      </div>
      <div className="container">
        {imagePreview ? (
          <img 
            src={imagePreview} 
            className="profile-pic" 
            alt="Profile" 
            style={{ 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%',
              objectFit: 'cover' 
            }} 
          />
        ) : (
          <AccountCircleRoundedIcon className="profile-pic" sx={{ fontSize: 150 }} />
        )}
        <div className="user-info">
          <h2>{userName}</h2>
        </div>
      </div>

      <div className="mb-1">
          Image <span className="font-css top">*</span>
          <div className="">
              <input 
                type="file" 
                id="file-input" 
                name="ImageStyle"
                accept="image/*"
                onChange={handleImageChange}
              />
          </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "20px auto", padding: " 20px", borderRadius: "8px",  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center" }}>
        <div className="info-div">
            <h2 className="info-section">My Bio</h2>
                <p className="bio-text-container">{bio}</p>
            <div>
              <h2 className="info-section">About Me</h2>
              <div className="interests-container">
               <div className="interest-item">
                null
               </div>
              </div>
            </div>
            <div>
              <h2 className="info-section">Interests</h2>
              <div className="interests-container">
                {interests.map((interest, index) => (
                  <div key={index} className="interest-item">
                    {interest}
                  </div>
                ))}
              </div>
            </div>
          <div className="edit-icon-container">
            <Link to="/editpage" className="edit-link">
              <EditRoundedIcon className="edit-icon" sx={{ fontSize: 30 }} />
            </Link>
          </div>
        </div>
      </div>
      <div className="log-out-button">
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