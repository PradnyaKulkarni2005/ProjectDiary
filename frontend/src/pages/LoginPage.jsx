import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';
import './LoginPage.css';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const roleFromURL = queryParams.get('role');
    if (roleFromURL) setRole(roleFromURL);
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
    console.log("Login Response:", response);

    const userId = response?.id;
    const userRole = response?.role || role;

    if (!userId || !userRole) {
      setError("Login response missing user ID or role.");
      return;
    }

    localStorage.setItem('userId', userId);
    localStorage.setItem('role', userRole);

    alert('Login successful!');
    navigate(`/${userRole}-dashboard`);
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
    setError(message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-container">
      <form className="form" onSubmit={handleLogin}>
        <h3 className="form-title">
          Login as <span style={{ textTransform: 'capitalize' }}>{role || 'user'}</span>
        </h3>

        {error && <p className="error-message">{error}</p>}

        <div className="flex-column"><label>Email</label></div>
        <div className="input-group">
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

        <div className="flex-column"><label>Password</label></div>
        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="input"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="options-row">
          <div>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember"> Remember me</label>
          </div>
          <span className="link">Forgot password?</span>
        </div>

        <button className="button-submit" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center">
          Don't have an account?
          <Link to="/register" className="link"> Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
