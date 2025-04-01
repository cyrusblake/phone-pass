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
  const [isLoading, setIsLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
      setIsLoading(true);
      setError('');
      try {
          const auth = getAuth();
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          await handleUserProfile(result.user);
          navigate('/home');
      } catch (error) {
          setError(error.message);
          console.error("Error with Google sign-in:", error);
      } finally {
          setIsLoading(false);
      }
  };

  return (
      <>
          <div className="nav-container">
              <Navbar/>
          </div>
          
          <div className='getstarted-container'>
              <h1 className="h1-main">Welcome to PhonePass</h1>
              
              <div className="button-container">
                  <SigButton 
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                  >
                      {isLoading ? 'Signing in...' : 'Continue with Google'}
                  </SigButton>
                  
                  <Link to="/signup" style={{ textDecoration: 'none' }}>
                      <button className='continue-with-email-button'>
                          Continue With Email
                      </button>
                  </Link>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className='terms-and-conditions-container'>
                  <p onClick={() => navigate('/terms')}>Terms & Conditions</p>
              </div>
          </div>
      </>
  )
}