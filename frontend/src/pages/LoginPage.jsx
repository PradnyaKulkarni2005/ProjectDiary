// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api'; // login API
import './LoginPage.css';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const roleFromURL = queryParams.get('role');
    setRole(roleFromURL);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      return setError('Please enter both email and password.');
    }

    try {
      setLoading(true);
      setError('');

      const response = await loginUser({ email, password, role });

      const userRole = response.role || role;
      alert('Login successful!');
      navigate(`/${userRole}-dashboard`);
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response.data.message);
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="form" onSubmit={handleLogin}>
        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
          Login as <span style={{ textTransform: 'capitalize' }}>{role || 'user'}</span>
        </h3>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <div className="flex-column"><label>Email</label></div>
        <div className="inputForm">
          <input
            type="email"
            name="email"
            className="input"
            placeholder="Enter your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex-column"><label>Password</label></div>
        <div className="inputForm">
          <input
            type="password"
            name="password"
            className="input"
            placeholder="Enter your Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex-row">
          <div>
            <input type="checkbox" />
            <label>Remember me</label>
          </div>
          <span className="span">Forgot password?</span>
        </div>

        <button className="button-submit" type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <p className="p">
          Don't have an account? <Link className="span" to="/register">Sign Up</Link>
        </p>

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
