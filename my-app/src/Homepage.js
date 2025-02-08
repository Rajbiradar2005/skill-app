import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Homepage.css";

const Homepage = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const profileIconRef = useRef(null);

  // Handle profile icon click
  const handleProfileClick = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Handle edit profile
  const handleEditProfile = () => {
    navigate("/Profile");
  };

  // Close the menu when clicking outside
  const handleClickOutside = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      !profileIconRef.current.contains(e.target)
    ) {
      setIsMenuVisible(false);
    }
  };

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => doc.data());
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  // Add event listener for outside clicks & fetch users
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    fetchUsers();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
        {/* Centered User Profiles Title */}
        <h2 className="user-profiles-title">User Profiles</h2>
        
        {/* Grid layout for user profiles */}
        <section className="user-profiles-grid">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div key={index} className="user-profile-card">
                <h3>{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Offered Services:</strong> {user.offeredServices.join(", ")}</p>
                <p><strong>Bio:</strong> {user.bio}</p>
              </div>
            ))
          ) : (
            <p>No user profiles found.</p>
          )}
        </section>
      </main>

      <footer className="homepage-footer">
        <p>&copy; 2023 Skill App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
