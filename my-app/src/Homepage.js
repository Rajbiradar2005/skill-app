import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Homepage.css";

const Homepage = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login state
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const profileIconRef = useRef(null);

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Convert user object to boolean
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleProfileClick = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => doc.data());
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to Skill App</h1>
        
        {/* Hide Login/Signup if authenticated */}
        {!isAuthenticated && (
          <div className="auth-buttons">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        )}

        {isAuthenticated && (
          <div className="profile-menu">
            <div className="profile-icon" ref={profileIconRef} onClick={handleProfileClick}>
              <span className="ghost-profile">👤</span>
            </div>
            {isMenuVisible && (
              <div className="profile-options" ref={menuRef}>
                <button onClick={() => navigate("/Profile")}>Edit Profile</button>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="homepage-main">
        <h2 className="user-profiles-title">User Profiles</h2>
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
    </div>
  );
};

export default Homepage;