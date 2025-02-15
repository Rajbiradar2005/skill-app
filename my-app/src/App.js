import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Login from './login';
import Signup from './Signup';
import Profile from './Profile'; // Import Profile component
import { auth } from './firebase'; // Firebase auth import
import './App.css';
import Homepage from './Homepage';

// Private route component
const PrivateRoute = ({ element }) => {
  return auth.currentUser ? element : <Navigate to="/login" />;
};

function App() {
  const location = useLocation(); // Get the current route

  console.log(location.pathname); // Check if location is correct

  return (
    <div className="App">
      <header className="App-header">
        <h1>Skill App</h1>
        <nav className="navbar">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
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
          <Route path="/Homepage" element={<Homepage />} /> {/* Add the homepage route */}
        </Routes>
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 Skill App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;