// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [role, setRole] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const roleFromURL = queryParams.get('role');
    setRole(roleFromURL);
  }, []);

  return (
    <>
      {/* <nav className="navbar">
        <h2>Final Year Project Portal</h2>
      </nav> */}

      <div className="login-container">
        <form className="form">
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
            Login as <span style={{ textTransform: 'capitalize' }}>{role || 'user'}</span>
          </h3>

          <div className="flex-column"><label>Email</label></div>
          <div className="inputForm">
            <svg width="20" height="20"><path d="..." /></svg>
            <input placeholder="Enter your Email" className="input" type="text" />
          </div>

          <div className="flex-column"><label>Password</label></div>
          <div className="inputForm">
            <svg width="20" height="20"><path d="..." /></svg>
            <input placeholder="Enter your Password" className="input" type="password" />
          </div>

          <div className="flex-row">
            <div>
              <input type="checkbox" />
              <label>Remember me</label>
            </div>
            <span className="span">Forgot password?</span>
          </div>

          <button className="button-submit">Sign In</button>
          <p className="p">Don't have an account? <span className="span">Sign Up</span></p>
          <p className="p line">Or With</p>

          <div className="flex-row">
            <button className="btn google">Google</button>
            <button className="btn apple">Apple</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
