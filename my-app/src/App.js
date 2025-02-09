import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Login from './login';
import Signup from './Signup';
import Profile from './Profile'; 
import { auth } from './firebase'; 
import './App.css';
import Homepage from './Homepage';

function App() {
  const location = useLocation(); // Get the current route
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

  useEffect(() => {
    // Check the user's authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // If user is logged in, set isAuthenticated to true
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  // Private route component for restricting access to Profile page
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Skill App</h1>
        <nav className="navbar">
          {/* Show login/signup only if user is not authenticated */}
          {!isAuthenticated && location.pathname !== '/Homepage' && location.pathname !== '/Profile' && (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
        </nav>
      </header>

      <main className="App-main">
        {/* Conditionally render the image only on the homepage */}
        {location.pathname === '/' && (
          <img 
            src="https://acegif.com/wp-content/uploads/gifs/handshake-46.gif" 
            alt="Welcome" 
            className="welcome-image" 
            style={{ width: "300px", height: "300px" }} 
          />
        )}

        <Routes>
          <Route path="/" element={<h2>Welcome to the Skill App</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Profile" element={<PrivateRoute element={<Profile />} />} /> {/* Restricted route */}
          <Route path="/Homepage" element={<Homepage />} /> {/* Homepage route */}
        </Routes>
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 Skill App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;