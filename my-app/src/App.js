import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './login';
import Signup from './Signup';

function App() {
  return (
    <div className="App">
      <nav style={styles.navbar}>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/signup" style={styles.link}>Sign Up</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to the Skill App</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

// Simple inline styles for navbar
const styles = {
  navbar: {
    backgroundColor: '#282c34',
    padding: '10px',
    textAlign: 'center',
  },
  link: {
    color: 'white',
    margin: '10px',
    textDecoration: 'none',
    fontSize: '18px',
  },
};

export default App;
