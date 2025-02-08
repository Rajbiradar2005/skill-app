import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase"; // Assuming firebase.js is in the parent folder
import "./Homepage.css";

const Homepage = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null); // Ref to track the menu div
  const profileIconRef = useRef(null); // Ref to track the profile icon

  // Handle profile icon click
  const handleProfileClick = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Handle edit profile
  const handleEditProfile = () => {
    navigate("/Profile"); // Redirect to Profile page
  };

  // Close the menu when clicking outside of the profile icon or menu
  const handleClickOutside = (e) => {
    if (
      menuRef.current && !menuRef.current.contains(e.target) && 
      !profileIconRef.current.contains(e.target)
    ) {
      setIsMenuVisible(false); // Close the menu if clicked outside
    }
  };

  // Add event listener to handle clicks outside of the profile menu
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup the listener
    };
  }, []);

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to Skill App</h1>
        <div className="profile-menu">
          <div
            className="profile-icon"
            ref={profileIconRef}
            onClick={handleProfileClick}
          >
            <span className="ghost-profile">👤</span>
          </div>
          {isMenuVisible && (
            <div className="profile-options" ref={menuRef}>
              <button onClick={handleEditProfile}>Edit Profile</button>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      </header>
      <main className="homepage-main">
        <section className="user-skills">
          <h2>Your Skills</h2>
          <p>Here you can list your skills and expertise. Make sure to keep this section updated to showcase your abilities.</p>
          <ul>
            <li>Skill 1</li>
            <li>Skill 2</li>
            <li>Skill 3</li>
          </ul>
        </section>
        <section className="user-preferences">
          <h2>Your Preferences</h2>
          <p>Specify your preferences for the types of services you are looking for. This helps us match you with the right opportunities.</p>
          <ul>
            <li>Preference 1</li>
            <li>Preference 2</li>
            <li>Preference 3</li>
          </ul>
        </section>
        <button className="start-button" onClick={() => navigate("/start")}>
          Start
        </button>
      </main>
      <footer className="homepage-footer">
        <p>&copy; 2023 Skill App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
