// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/Registration'; // ✅ new page
import CoordinatorDashboard from './pages/CoordinatorDashboard'; // optional

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/coordinator" element={<CoordinatorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
