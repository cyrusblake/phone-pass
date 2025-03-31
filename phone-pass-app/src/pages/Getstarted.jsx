import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getUserProfile, createUserProfile } from '../api/firestore';
import SigButton from '../components/SigButton';
import Navbar from "../components/Navbar";
import '../styles/components/getstarted.css';

export default function GetStarted() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [error, setError] = useState('');



    const handleUserProfile = async (user) => {
      const profile = await getUserProfile(user.uid);
      if (!profile) {
          // For Google sign-in, user might have displayName and no firstName/lastName
        const nameParts = user.displayName ? user.displayName.split(' ') : ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
          
        await createUserProfile(user.uid, {
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          name: user.displayName || `${firstName} ${lastName}`,
        });
      }
    };

    return (
        <>
            <div className="nav-container">
              <Navbar/>
            </div>
            
            <div className='getstarted-container'>
              <h1> Welcome to PhonePass</h1>
              <br/>
                <div className='login-logo'></div>
                <div className=''>
                  <SigButton 
                    onClick={() => {
                      const auth = getAuth();
                      const provider = new GoogleAuthProvider();
                      signInWithPopup(auth, provider)
                        .then((result) => {
                          const user = result.user;
                          handleUserProfile(user);
                          navigate('/home');
                        })
                        .catch((error) => {
                          setError(error.message);
                          console.error("Error with Google sign-in:", error);
                          });
                        }}
                    />
                    
                </div>
                <br/>
                <div>
                  <Link to="/signup">
                        <button className='login-button'>Continue With Email</button>
                    </Link>
                </div>
                <div className='terms-and-conditions-container'>
                    <p>Terms & Conditions</p>
                </div>
            </div>
        </>
    )
}