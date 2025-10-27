import React, { useState } from "react";
import "./signin.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiFetch from "../../utils/apiFetch";
import { showError, showSuccess } from '../../utils/alert';

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState<'customer'|'admin'>('customer');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });
      login(data.token, data.role);
      try {
        await showSuccess('Login successful', 'Welcome back');
      } catch (swalErr) {
        // eslint-disable-next-line no-console
        console.warn('showSuccess failed', swalErr);
      }
      navigate("/");
    } catch (err: any) {
      // Normalize error message coming from apiFetch (which may attach body)
      // and log to console for debugging when alerts don't appear.
      // eslint-disable-next-line no-console
      console.error('Signin error', err);
      const message = err?.body?.error || err?.body?.message || err?.message || 'Something went wrong';
      setError(message);
      try {
        const r = await showError('Sign in failed', message);
        // eslint-disable-next-line no-console
        console.log('Swal shown for sign in error', r);
      } catch (swalErr) {
        // eslint-disable-next-line no-console
        console.error('Swal error', swalErr);
        // Fallback to native alert if Swal fails to render
        // eslint-disable-next-line no-alert
        alert(`Sign in failed: ${message}`);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-left">
            <div className="left-gradient" style={{ backgroundImage: "url('/hero-man.png')" }}>
              <div className="sidebar-icons">
                <div className="icon">S</div>
                <div className="icon">🏠</div>
                <div className="icon">⚙️</div>
                <div className="icon">💬</div>
              </div>

              <div className="avatar avatar-large">AB</div>
              <div className="avatar avatar-small top">MJ</div>
              <div className="avatar avatar-small bottom">HS</div>
            </div>
          </div>
          <div className="auth-right">
            {/* <button className="close-btn" aria-label="close">×</button> */}
            <h2 className="auth-title">Sign in to your account</h2>
            <p className="auth-sub">Access orders, wishlist and faster checkout.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <label>Role</label>
              <div className="role-group" role="radiogroup" aria-label="Sign in role">
                <button
                  type="button"
                  className={`role-option ${role === 'customer' ? 'active' : ''}`}
                  onClick={() => setRole('customer')}
                >
                  Customer
                </button>
                <button
                  type="button"
                  className={`role-option ${role === 'admin' ? 'active' : ''}`}
                  onClick={() => setRole('admin')}
                >
                  Admin
                </button>
              </div>

              {error && <div className="error-text">{error}</div>}

              <button type="submit" className="primary-btn">Sign In</button>

              <p className="muted">
                Don't have an account? <span className="link" onClick={() => navigate('/signup')}>Sign up</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
