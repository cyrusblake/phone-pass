import React from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logOut } = useAuth();

  return (
    <nav>
      <h1>StreetPass</h1>
      {currentUser && (
        <button onClick={logOut}>Log Out</button>
      )}
    </nav>
  );
};

export default Navbar;