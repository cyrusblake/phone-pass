import React from "react";
import '../styles/components/navbar.css';
import { useAuth } from "../context/AuthContext";

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
    </nav>
  );
};

export default Navbar;