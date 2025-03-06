import React, { use } from "react";
import { signInWithGoogle, signOutFromGoogle } from "../api/auth";
import useAuth from "../hooks/useAuth";



const Navbar = () => {
  const { user, loading} = useAuth();
  // const { currentUser, logOut } = useAuth();

  return (
    <nav>
      <div>

      <h1>PhonePass</h1>
      {!loading && (
        <button 
          type='button'
          className=''
          onClick={user ? signOutFromGoogle : signInWithGoogle}
        >
        Log {user ? 'out' : 'in'}
        </button>
      )}
      </div>
      
    </nav>
  );
};

export default Navbar;