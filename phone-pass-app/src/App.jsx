import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ViewPage from "./pages/ViewPage";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
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
