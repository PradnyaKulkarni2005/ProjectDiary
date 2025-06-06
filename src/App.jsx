// src/App.jsx
import React from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  const pathname = window.location.pathname;

  return (
    <>
      <Navbar />
      {pathname === '/' && <HomePage />}
      {pathname.startsWith('/login') && <LoginPage />}
    </>
  );
}

export default App;
