// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import './LoginPage.css'; // Using the same styles as login
import Swal from 'sweetalert2';

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

      // Register API call
      await registerUser({ email, password, role });
      Swal.fire({
      icon: 'success',
      title: 'Registeration Successful !',
      text: `Welcome ${email}!`,
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
      toast: true,
      position: 'top-middle'
    });
      navigate(`/login?role=${role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
     
  };

  return (
    <div className="login-container">
      <form className="form" onSubmit={handleSubmit}>
        <h3>Create Account</h3>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <div className="input-group"><label>Email</label>
       
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group"><label>Password</label>
        
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            className="input"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group"><label>Confirm Password</label>
        
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter password"
            className="input"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group"><label>Select Role</label>
        
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

        <button className="button-submit" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center">
          Already have an account?{' '}
          <span className="link" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
