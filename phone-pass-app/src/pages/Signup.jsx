import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getUserProfile, createUserProfile } from '../api/firestore';
import '../styles/components/signup.css';
import Navbar from "../components/Navbar";
import SigButton from '../components/SigButton';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await handleUserProfile(user);
      navigate('/home');
    } catch (error) {
      setError(error.message);
      console.error("Error creating user:", error);
    }
  };

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
        <Navbar />
      </div>

      <div className='form-container'>
        <form className='form-box' onSubmit={handleSubmit}>
          <h1>First Name</h1>
          <input 
            name='firstName' 
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
          <br />
          <h1>Last Name</h1>
          <input 
            name='lastName' 
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
          <br />
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
          <button id='sign-up-button' type="submit">Sign Up</button>
          <br />
          <h1>Or</h1>
          <br/>
          <Link to="/login">
              <button id='sign-up-button'>Log In</button>
          </Link>
        </form>
        

      </div>
    </>
  );
};

export default Signup;