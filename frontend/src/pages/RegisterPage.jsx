// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, role } = form;

    // Basic validation
    if (!email || !password || !confirmPassword || !role) {
      return setError('Please fill in all fields.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      setLoading(true);
      setError('');
      // Send only the necessary fields
      await registerUser({ email, password, role });
      alert('Registration successful!');
      navigate(`/login?role=${role}`);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="form" onSubmit={handleSubmit}>
        <h3 className="form-title">Create Account</h3>

        {error && <p className="error-message">{error}</p>}

        <div className="flex-column"><label>Email</label></div>
        <div className="inputForm">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="flex-column"><label>Password</label></div>
        <div className="inputForm">
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            className="input"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="flex-column"><label>Confirm Password</label></div>
        <div className="inputForm">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter password"
            className="input"
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
          >
            <option value="">-- Select Role --</option>
            <option value="student">Student</option>
            <option value="guide">Guide</option>
            <option value="coordinator">Coordinator</option>
            <option value="hod">HOD</option>
            <option value="director">Director</option>
          </select>
        </div>

        <button className="button-submit" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="p">
          Already have an account?{' '}
          <span className="span" onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
