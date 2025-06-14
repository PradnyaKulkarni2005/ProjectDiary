
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api'; // import login API
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

      // assuming the response contains role
      const userRole = response.role || role;
      alert('Login successful!');
      navigate(`/${userRole}-dashboard`);
    } catch (err) {
  if (err.response?.status === 403) {
    setError(err.response.data.message);
  } else {
    setError(err.response?.data?.message || 'Login failed. Please try again.');
  }
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="form" onSubmit={handleLogin}>
        <h3>
          Login as <span style={{ textTransform: 'capitalize' }}>{role || 'user'}</span>
        </h3>

        {/* Email */}
        <div className="input-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />
        </div>

        {/* Password */}
        <div className="input-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />
        </div>

        {/* Remember me & forgot */}
        <div className="options-row">
          <div>
            <input type="checkbox" />
            <label>Remember me</label>
          </div>
          <span className="link">Forgot password?</span>
        </div>

        {/* Submit */}
        <button className="button-submit" type="submit">Sign In</button>

        {/* Register link */}
        <p className="text-center">
          Don't have an account?
          <Link to="/register" className="link"> Sign Up</Link>
        </p>

        {/* You can uncomment this if you want social login buttons later */}
        {/* 
        <p className="text-center">Or Sign In With</p>
        <div className="social-buttons">
          <button className="social-button">Google</button>
          <button className="social-button">Apple</button>
        </div> 
        */}
      </form>
    </div>
  );
}

export default LoginPage;
