import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navbar/>

      <h1>Welcome {user ? user.displayName : "Guest"} to PhonePass!</h1>
      <p>Connect with users nearby and exchange data.</p>
      {user && (
        <button>
          <a href="/profile">Go to Profile</a>
        </button>
      )}
    </div>
  );
};

export default Home;