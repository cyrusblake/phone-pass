import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { accountProfile, getUserAccount, getUserProfile } from '../api/firestore';
import '../styles/components/editpage.css';

const EditPage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [userName, setuserName] = useState("");
    const [bio, setBio] = useState("");
    const [interests, setInterests] = useState([]);
    const navigate = useNavigate();

    // Fetch the current profile data
    useEffect(() => {
       
            if (user) {
                const fetchProfile = async () => {
                    const accountData = await getUserAccount(user.uid);
                    setProfile(accountData);
                    setuserName(accountData?.username || "");
                    setBio(accountData?.bio || "");
                    setInterests(accountData?.interests || []); // Initialize interests from accountData
                };
               fetchProfile();
            }

       
    }, [user]);

    const handleSave2 = async () => {
        if (user) {
            // Fetch the current profile data
            const currentProfile = await getUserProfile(user.uid);

            // Construct the updated profile object
            const updatedProfile = {};

            // Only add fields to the updatedProfile if they have valid values
            if (userName.trim()) {
                updatedProfile.username = userName;
            } else {
                updatedProfile.username = currentProfile.username; // Keep existing value
            }

            if (bio.trim()) {
                updatedProfile.bio = bio;
            } else {
                updatedProfile.bio = currentProfile.bio; // Keep existing value
            }

            if (interests.length > 0) {
                updatedProfile.interests = interests;
            } else {
                updatedProfile.interests = currentProfile.interests; // Keep existing value
            }

            // Save the updated profile to Firestore
            await accountProfile(user.uid, updatedProfile);
            alert("Profile saved!");
            navigate('/profile');
        }
    };

    return (
        <>
            <Navbar />
            <div className='edit-page'>
                <h1 className="f1">Edit Page</h1>
                <p>This is the edit page where you can modify your profile.</p>
                
                <div>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setuserName(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Enter your bio"
                    />
                </div>
                <div className='i-input'>
                    <input
                        type="text"
                        value={interests.join(',')} // Display interests as a comma-separated string
                        onChange={(e) => setInterests(e.target.value.split(','))}
                        placeholder="Interests (comma separated)"
                    />
                </div>
                <button onClick={handleSave2} className="u-button">Save</button>
            </div>
        </>
    );
};

export default EditPage;