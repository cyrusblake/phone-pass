import React from "react";
import '../styles/components/navbar.css';
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div>
        <h1 className="nh">
          <a href="/">PhonePass</a>
        </h1>
      </div>
      
      <div>
        <Link to={user ? "/profile" : "#"} style={{ pointerEvents: user ? "all" : "none" }}>   
          <AccountCircleRoundedIcon className="profile-pic" sx={{ fontSize: 50 }} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
