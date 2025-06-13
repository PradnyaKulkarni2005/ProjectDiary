// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const roleFromURL = queryParams.get('role');
    setRole(roleFromURL);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // ✅ Navigate to the correct dashboard route
    navigate('/dashboard/coordinator');
  };

  return (
    <div className="login-container">
      <form className="form" onSubmit={handleLogin}>
        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
          Login as <span style={{ textTransform: 'capitalize' }}>{role || 'user'}</span>
        </h3>

        <div className="flex-column"><label>Email</label></div>
        <div className="inputForm">
          <input placeholder="Enter your Email" className="input" type="text" required />
        </div>

        <div className="flex-column"><label>Password</label></div>
        <div className="inputForm">
          <input placeholder="Enter your Password" className="input" type="password" required />
        </div>

        <div className="flex-row">
          <div>
            <input type="checkbox" />
            <label>Remember me</label>
          </div>
          <span className="span">Forgot password?</span>
        </div>

        <button className="button-submit" type="submit">Sign In</button>

        <p className="p">Don't have an account? <Link className="span" to="/register">Sign Up</Link></p>

        <p className="p line">Or With</p>

        <div className="flex-row">
          <button className="btn google" type="button">Google</button>
          <button className="btn apple" type="button">Apple</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
