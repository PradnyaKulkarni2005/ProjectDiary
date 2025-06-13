// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { username, email, password, confirmPassword, role } = form;

    if (!username || !email || !password || !confirmPassword || !role) {
      return setError('Please fill in all fields.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    // Simulate registration logic (you can later add real backend call)
    console.log('User registered:', form);
    alert('Registration successful!');
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="login-container">
      <form className="form" onSubmit={handleSubmit}>
        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Create Account</h3>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <div className="flex-column"><label>Username</label></div>
        <div className="inputForm">
          <input
            placeholder="Enter your name"
            className="input"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div className="flex-column"><label>Email</label></div>
        <div className="inputForm">
          <input
            placeholder="Enter your email"
            className="input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="flex-column"><label>Password</label></div>
        <div className="inputForm">
          <input
            placeholder="Enter password"
            className="input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="flex-column"><label>Confirm Password</label></div>
        <div className="inputForm">
          <input
            placeholder="Re-enter password"
            className="input"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="flex-column"><label>Select Role</label></div>
        <div className="inputForm">
          <select
            className="input"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Role --</option>
            <option value="student">Student</option>
            <option value="guide">Guide</option>
            <option value="coordinator">Coordinator</option>
            <option value="hod">HOD</option>
            <option value="director">Director</option>
          </select>
        </div>

        <button className="button-submit" type="submit">Register</button>
        <p className="p">
          Already have an account?{' '}
          <span className="span" onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
