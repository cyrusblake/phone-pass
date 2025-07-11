import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import ViewPage from "./pages/ViewPage.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Getstarted from "./pages/Getstarted.jsx";
import FriendsList from "./pages/FriendsList.jsx";
import EditPage from "./pages/EditPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Map from "./pages/Map.jsx";
import './App.css';

const App = () => {
  return (
    <> 
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Getstarted />} />
          <Route path="/friends" element={<FriendsList />} />
          <Route path="/ViewPage/:userId" element={<ViewPage/>} />
          <Route path="/editpage" element={<EditPage />} />
          <Route path="/map" element={<Map/>}/>
        </Routes>
      </Router>
    </AuthProvider>
   
    </>
   
  );
};

export default App;
