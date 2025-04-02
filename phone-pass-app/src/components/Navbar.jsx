import React from "react";
import '../styles/components/navbar.css';
import { useAuth } from "../context/AuthContext";
import ppic from '../assets/square.png';
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, loading, signIn, signOut } = useAuth();

  const handleClick = () => {
    if (user) {
      signOut();
    } else {
      signIn();
    }
  };

  return (
    <nav className="navbar">
      <div>
        <h1 className="nh">
          <a href="/">PhonePass</a>
        </h1>
      </div>
      
      
      {user &&
      <Link to="/profile">
       <img src={ppic} alt="Profile" className="profile-pic" />
      </Link>}


     
      
            {/* <div>
              
              {!loading && (
                <button 
                  type='button'
                  className='nb'
                  onClick={handleClick}
                >
                  Log {user ? 'out' : 'in'}
                </button>
              )}
            </div> */}
    </nav>
  );
};

export default Navbar;
