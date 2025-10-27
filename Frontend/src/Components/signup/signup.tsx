import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiFetch from '../../utils/apiFetch';
import { showError, showSuccess } from '../../utils/alert';
// react-toastify removed — use component state for errors instead of toasts

const Signup: React.FC = () => {
  const navigate = useNavigate();
  // We'll auto-login after successful signup so we need auth actions
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  // backendUrl is unused; apiFetch handles backend prefixing

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !email || !password) {
      setError('Please fill out all required fields');
      return;
    }
    try {
      const regData: any = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, role }),
      });

      // If the register endpoint returns a token immediately, use it to sign the user in
      if (regData && regData.token) {
        login(regData.token, regData.role || role);
        await showSuccess('Signed in', 'Welcome! You are now logged in.');
        navigate('/');
        return;
      }

      // Otherwise attempt to login (fallback) and navigate
      try {
        const data = await apiFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password, role }),
        });
        login(data.token, data.role);
        await showSuccess('Signed in', 'Welcome! You are now logged in.');
        navigate('/');
        return;
      } catch (loginErr: any) {
        // If auto-login fails, inform user and send them to signin
        // eslint-disable-next-line no-console
        console.warn('Auto-login after signup failed', loginErr);
        await showSuccess('Account created', 'You can now sign in with your credentials.');
        navigate('/auth?mode=signin');
        return;
      }
    } catch (err: any) {
      // Log and normalize errors so the modal shows reliable text
      // eslint-disable-next-line no-console
      console.error('Signup error', err);
      const message = err?.body?.error || err?.body?.message || err?.message || 'Network error';
      setError(message);
      try {
        const r = await showError('Sign up failed', message);
        // eslint-disable-next-line no-console
        console.log('Swal shown for signup error', r);
      } catch (swalErr) {
        // eslint-disable-next-line no-console
        console.error('Swal error', swalErr);
        // eslint-disable-next-line no-alert
        alert(`Sign up failed: ${message}`);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-left">
            <div className="left-gradient" style={{ backgroundImage: "url('/signup.jpg')" }}>
              <div className="sidebar-icons">
                <div className="icon">S</div>
                <div className="icon">🏠</div>
                <div className="icon">⚙️</div>
                <div className="icon">💬</div>
              </div>

              <div className="avatar avatar-large">CD</div>
              <div className="avatar avatar-small top">AL</div>
              <div className="avatar avatar-small bottom">TR</div>
            </div>
          </div>

          <div className="auth-right">
            {/* <button className="close-btn" aria-label="close">×</button> */}
            <h2 className="auth-title">Create account</h2>
            <p className="auth-sub">Sign up and get 30% off your first order</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>Full name</label>
              <input placeholder="Full name" required value={username} onChange={e => setUsername(e.target.value)} type="text" />

              <label>Email</label>
              <input placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} type="email" />

              <label>Password</label>
              <input placeholder="Create a password" required value={password} onChange={e => setPassword(e.target.value)} type="password" />

              <label>Role</label>
              <div className="role-group" role="radiogroup" aria-label="Sign up role">
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

              <button className="primary-btn" type="submit">Create account</button>

              <p className="muted">Already have an account? <span className="link" onClick={() => navigate('/signin')}>Sign In</span></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
