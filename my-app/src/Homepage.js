import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase"; // Assuming firebase.js is in the parent folder
import "./Homepage.css";

const Homepage = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleEditProfile = () => {
    navigate("/Profile"); // Redirect to Profile page
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to Skill App</h1>
        <div className="profile-menu">
          <div className="profile-icon" onClick={handleProfileClick}>
            <span className="ghost-profile">👤</span>
          </div>
          {isMenuVisible && (
            <div className="profile-options">
              <button onClick={handleEditProfile}>Edit Profile</button>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      </header>
      <main className="homepage-main">
        <p>Here is your homepage content!</p>
      </main>
      <footer className="homepage-footer">
        <p>&copy; 2023 Skill App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;