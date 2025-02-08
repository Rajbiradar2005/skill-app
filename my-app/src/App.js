import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './login';
import Signup from './Signup';
import './App.css';

function App() {
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
        <Routes>
          <Route path="/" element={<h2>Welcome to the Skill App</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <footer className="App-footer">
        <p>&copy; 2023 Skill App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;