import React, { use } from 'react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { accountProfile} from '../api/firestore';
import '../styles/components/editpage.css';

const EditPage = () => {
    const { user } = useAuth();
    const [userName, setuserName] = useState("");
    const [bio, setBio] = useState("");
    const [interests, setInterests] = useState([]);
    const navigate = useNavigate();

    const handleSave2 = async () => {
        if (user) {
          await accountProfile(user.uid, {
            bio: bio,
            uid: user.uid,
            username: userName,
            interests: interests,
          });
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
            {/* Add your edit form or components here */}
            
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
            <div>
            <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Interests (comma separated)"
                />
            </div>
        
            <button onClick={handleSave2} className="u-button">Save</button>
        </div>
        </>
       
    );
}


export default EditPage;