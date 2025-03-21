import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import ViewPage from "./pages/ViewPage.jsx";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext.jsx";
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ViewPage/:userId" element={<ViewPage/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
