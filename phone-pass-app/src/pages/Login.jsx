import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

import { 
  getAuth, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { getUserProfile, createUserProfile } from '../api/firestore';
import '../styles/components/signup.css';
import Navbar from "../components/Navbar";
import SigButton from '../components/SigButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    if (!email || !password) {
        setError('Please enter both email and password');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Successful login - redirect to home
        navigate('/Home');
    } catch (error) {
        console.error("Login error:", error);
        
        // More specific error handling
        switch (error.code) {
            case 'auth/invalid-credential':
                setError('Invalid email or password');
                break;
            case 'auth/user-not-found':
                setError('No account found with this email');
                break;
            case 'auth/wrong-password':
                setError('Incorrect password');
                break;
            case 'auth/too-many-requests':
                setError('Account temporarily disabled due to too many requests');
                break;
            default:
                setError('Failed to sign in. Please try again.');
        }
    }
  }   

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
      <div className='nav-container'>
        <Navbar />
      </div>


      <div className="signup-container">
      <div id="main">
              <div className='form-container'>
              <form className='form-box' onSubmit={handleSubmit}>
                <h1>Your Email</h1>
                <input
                  name='email'
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}   
                  autoComplete='email'
                  required
                />
                <br />
                <h1>Password</h1>
                <input
                  name='password'
                  type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete='new-password'
                  required
                  minLength={6}
                />
                <br />
                {error && <div className="error-message">{error}</div>}
                <button id='sign-up-button' type="submit">Log In</button>
                <br />
                <h1>Or</h1>
                <br/>
                <Link to="/signup">
                    <button id='sign-up-button'>Sign Up</button>
                </Link>
            </form>
            
              
          </div>
        </div>
      </div>
    

      
    </>
  );
};

export default Login;